# ---------------------------------------------------------------------
# Professeur/Auteur : Akram Nasr
# Courriel : Akram.Nasr@cmontmorency.qc.ca
# Cours : 420 4E6 MO - Analyse et conception de modèles
# ---------------------------------------------------------------------

import json
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy

import os
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)


with open('db.json', 'r') as config_file:
    config = json.load(config_file)

# Set a secret key for session management (replace with a secure random key for production)
app.secret_key = config['mySecretKey']

# Load database configuration from db.json


# Construct the database URI (adjust the keys in db.json accordingly)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{config['username']}:{config['password']}@{config['host']}/{config['database']}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Dossier de sauvegarde des images (assurez-vous que ce dossier existe)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'images')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# ---------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------

# User model for login
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # In production, store hashed passwords!

    def __repr__(self):
        return f"<User {self.username}>"

# Menu Item model
class MenuItem(db.Model):
    __tablename__ = 'menuitem'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # e.g., "breuvages" or "food"
    price = db.Column(db.Float, nullable=False)
    picture = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

# Contact model
class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    prenom = db.Column(db.String(100), nullable=False)
    nom = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    notification_method = db.Column(db.String(20), nullable=False)
    telephone = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

# Contact model
class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)            
    card_number = db.Column(db.String(20), nullable=False)        
    items = db.Column(db.String(255), nullable=False)            
    total_price = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="En cours")   
    date = db.Column(db.DateTime, default=datetime.utcnow)


# Create all tables if they don't exist yet
#with app.app_context():
    #db.create_all()

# ---------------------------------------------------------------------
# Web Routes for pages
# ---------------------------------------------------------------------

# Main route
@app.route('/')
def home():
    return render_template('index.html')

# Login route 
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get the credentials from the form
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Look up the user in the database (for production, verify hashed passwords)
        user = User.query.filter_by(username=username, password=password).first()
        
        if user:
            # Set the session and redirect to the protected admin page
            session['user'] = user.username
            return redirect(url_for('admin'))
        else:
            flash('Invalid username or password', 'danger')
            return redirect(url_for('login'))
    
    return render_template('login.html')

# Admin route (Private)
@app.route('/admin')
def admin():
    if 'user' not in session:
        flash('Please log in to access the admin panel.', 'warning')
        return redirect(url_for('login'))
    
    # Render the admin UI (admin.html) and pass the logged-in username
    return render_template('admin.html', username=session['user'])


# Logout route (Kill session)
@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))


# ---------------------------------------------------------------------
# End Web Routes for pages
# ---------------------------------------------------------------------

# ----------------------------
# Client API (public) 
# ----------------------------

# Add an order 
@app.route('/api/addOrder', methods=['POST'])
def add_order():
    data = request.get_json()

    print(data)

    # Retrieve required fields from the JSON payload.
    user = data.get('user')
    card_number = data.get('card_number')
    items = data.get('items')  # Expecting a string (e.g., "Café au lait, Poutine")
    total_price = data.get('total_price')
    
    # Basic backend validation: ensure all required fields are provided.
    if not user or not card_number or not items or total_price is None:
        return jsonify({'error': 'Les champs user, card_number, items et total_price sont requis.'}), 400

    # Create a new order record. The status is set by default to "En cours".
    new_order = Order(
        user=user,
        card_number=card_number,
        items=items,
        total_price=total_price,
        status="En cours"
    )
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({'message': 'Commande enregistrée avec succès.'}), 201

# Add a new message 
@app.route('/api/contact', methods=['POST'])
def add_contact():
    data = request.get_json()
    prenom = data.get('prenom')
    nom = data.get('nom')
    category = data.get('category')
    notification_method = data.get('notification_method')
    telephone = data.get('telephone')
    email = data.get('email')
    description = data.get('description')

    # Validate prenom: required, at least 3 characters, first letter uppercase.
    if not prenom or len(prenom.strip()) < 3 or prenom.strip()[0] != prenom.strip()[0].upper():
        return jsonify({'error': 'Prénom invalide. Merci de saisir au moins 3 caractères et la première lettre en majuscule.'}), 400

    # Validate nom: required, ≤ 50 characters, must be all uppercase.
    if not nom or len(nom.strip()) == 0 or len(nom.strip()) > 50 or nom.strip() != nom.strip().upper():
        return jsonify({'error': 'Nom invalide. Merci de saisir un nom en majuscules et au maximum 50 caractères.'}), 400

    # Validate category: required.
    if not category:
        return jsonify({'error': 'La catégorie de demande est requise.'}), 400

    # Validate notification_method: must be one of the allowed values.
    if notification_method not in ['none', 'courriel', 'sms']:
        return jsonify({'error': 'Méthode de notification invalide.'}), 400

    # If notification_method is "courriel", email is required and must be valid.
    if notification_method == 'courriel':
        if not email:
            return jsonify({'error': 'Le courriel est requis pour la notification par courriel.'}), 400
    
    # If notification_method is "sms", telephone is required.
    if notification_method == 'sms':
        if not telephone:
            return jsonify({'error': 'Le numéro de téléphone est requis pour la notification par SMS.'}), 400

    # Validate description: required and at least 5 characters.
    if not description or len(description.strip()) < 5:
        return jsonify({'error': 'La description du message doit comporter au moins 5 caractères.'}), 400

    # All validations passed, create and save the new contact record.
    new_contact = Contact(
        prenom=prenom.strip(),
        nom=nom.strip(),
        category=category,
        notification_method=notification_method,
        telephone=telephone.strip() if telephone else None,
        email=email.strip() if email else None,
        description=description.strip()
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({'message': 'Votre demande a été envoyée avec succès.'}), 201


# ----------------------------
# Admin API (Private)
# ----------------------------

# Display clients orders
@app.route('/api/admin/orders', methods=['GET'])
def admin_get_orders():
    orders = Order.query.order_by(Order.date.desc()).all()
    orders_list = []
    for order in orders:
        orders_list.append({
            'id': order.id,
            'user': order.user,
            'card_number': order.card_number,
            'items': order.items,
            'total_price': order.total_price,
            'date': order.date.strftime("%Y-%m-%d %H:%M:%S"),
            'status': order.status
        })
    return jsonify(orders_list)

# Display edit clients orders status
@app.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def admin_update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    new_status = data.get('status')
    if new_status:
        order.status = new_status
        db.session.commit()
        return jsonify({'message': 'Order status updated successfully.'})
    else:
        return jsonify({'error': 'Status not provided.'}), 400

# Display clients messages
@app.route('/api/admin/contacts', methods=['GET'])
def admin_get_contacts():
    contacts = Contact.query.order_by(Contact.date.desc()).all()
    contacts_list = []
    for contact in contacts:
        contacts_list.append({
            'id': contact.id,
            'prenom': contact.prenom,
            'nom': contact.nom,
            'category': contact.category,
            'notification_method': contact.notification_method,
            'telephone': contact.telephone,
            'email': contact.email,
            'description': contact.description,
            'date': contact.date.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(contacts_list)


# Display full menu
@app.route('/api/admin/menu', methods=['GET'])
def admin_get_menu_items():
    items = MenuItem.query.all()
    items_list = []
    for item in items:
        items_list.append({
            'id': item.id,
            'name': item.name,
            'category': item.category,
            'price': item.price,
            'picture': item.picture,
            'description': item.description
        })
    return jsonify(items_list)

# Add item to menu
@app.route('/api/admin/menu', methods=['POST'])
def admin_add_menu_item():
    # Récupérer les autres champs du formulaire
    name = request.form.get('name')
    category = request.form.get('category')
    price = request.form.get('price')
    description = request.form.get('description')
    
    # Vérifier qu'un fichier image est présent dans la requête
    if 'itemPicture' not in request.files:
        return jsonify({'error': 'Le fichier image est requis.'}), 400

    file = request.files['itemPicture']
    
    # Vérifier si le fichier a un nom (et éventuellement vérifier son extension)
    if file.filename == '':
        return jsonify({'error': "Aucun fichier n'a été sélectionné."}), 400

    # Vérifier que tous les champs obligatoires sont présents
    if not name or not category or price is None:
        return jsonify({'error': 'Les champs nom, catégorie et prix sont requis.'}), 400

    # Convertir le prix en float
    try:
        price = float(price)
    except ValueError:
        return jsonify({'error': 'Le prix doit être un nombre.'}), 400

    # Sécuriser le nom du fichier et lui attribuer un nom aléatoire
    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    # Sauvegarder le fichier dans le dossier UPLOAD_FOLDER
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
    
    # Créer le nouvel article avec le nom de fichier enregistré
    new_item = MenuItem(
        name=name,
        category=category,
        price=price,
        description=description,
        picture=unique_filename
    )
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({'message': 'Article ajouté avec succès.'}), 201

# Edit menu item
@app.route('/api/admin/menu/<int:item_id>', methods=['PUT'])
def admin_update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    
    # Récupérer les autres champs
    name = request.form.get('newItemName')
    category = request.form.get('newItemCategory')
    price = request.form.get('newItemPrice')
    description = request.form.get('newItemDescription')
    picture = request.form.get('newItemPicture')
    
    # Mettre à jour les champs si fournis et différents
    if name and name != item.name:
        item.name = name
    if category and category != item.category:
        item.category = category
    if price:
        try:
            price = float(price)
            if price != item.price:
                item.price = price
        except ValueError:
            return jsonify({'error': 'Le prix doit être un nombre.'}), 400
    if description and description != item.description:
        item.description = description
    
    # Si un nouveau fichier image est envoyé, le traiter
    if 'newItemPicture' in request.files:
        file = request.files['newItemPicture']
        if file and file.filename != '':
            filename = secure_filename(file.filename)
            ext = os.path.splitext(filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            # Vous pouvez, si nécessaire, supprimer l'ancienne image ici
            item.picture = unique_filename
    
    db.session.commit()
    return jsonify({'message': 'Article modifié avec succès.'})


# Delete menu item
@app.route('/api/admin/menu/<int:item_id>', methods=['DELETE'])
def admin_delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted successfully.'})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
