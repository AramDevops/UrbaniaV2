
Installation de URBANIA_APP

Professeur/Auteur : Akram Nasr  
Courriel : Akram.Nasr@cmontmorency.qc.ca  
Cours : 420 4E6 MO - Analyse et conception de modèles

Architecture du projet :


📂 Desktop
 ├── 📂 URBANIA_APP
 │    ├── 📜 mydatabase.sql       <-- Fichier SQL
 │    ├── 📜 setup_db.bat         <-- Script d'installation de la DB (auto-installation)
 │    ├── 📜 setup_app.bat        <-- Script d'installation de l'app (auto-installation)
 │    ├── 📂 CafeUrbaniaV2
 │    │    ├── 📜 app.py          <-- Code principal de l'application
 │    │    ├── 📜 requirements.txt
 │    │    ├── 📜 db.json
 │    │    ├── 📂 static
 │    │    ├── 📂 templates
 │    │    ├── 📂 venv           <-- À créer


Installation automatique

1. Positionnement du projet  
   Placez le dossier du projet sur votre bureau et nommez-le URBANIA_APP (ne modifiez pas ce nom).

2. Configuration de la base de données  
   - Assurez-vous que XAMPP est lancé et que le serveur SQL est en fonctionnement.  
   - Exécutez le script `setup_db.bat` situé à la racine du dossier URBANIA_APP. Ce script se chargera d'importer le fichier `mydatabase.sql` pour créer et configurer la base de données.

3. Configuration de l'application  
   - Si la configuration de la base de données se déroule correctement, exécutez ensuite le script `setup_app.bat`.  
   - Ce script complète l'installation de l'application et, une fois terminé, démarre l'application.  
   - Une URL s'affichera pour vous permettre d'accéder à l'application via votre navigateur.


Installation manuelle (obligatoire en cas de problème avec l'installation automatique)

1. Accéder au répertoire de l'application  
   Ouvrez une fenêtre PowerShell et naviguez dans le dossier contenant le code de l'application avec la commande suivante :  
   
   cd Desktop\URBANIA_APP\CafeUrbaniaV2
   

2. Création et activation de l'environnement virtuel  
   - Création du venv :  
     
     python -m venv venv
       
   - Activation du venv :  
     Si l'activation de l'environnement virtuel est bloquée par les restrictions de sécurité de Windows, exécutez d'abord :  
     
     Set-ExecutionPolicy Unrestricted -Force
       
     Puis activez l'environnement virtuel :  
     
     .\venv\Scripts\Activate.ps1
     

3. Installation des dépendances  
   Installez les dépendances nécessaires en exécutant :  
   
   python -m pip install -r requirements.txt
   

4. Lancement de l'application  
   Démarrez l'application en exécutant :  
   
   python app.py
     
   Une fois l'application lancée, une URL vous sera affichée pour accéder à l'application via votre navigateur.


Remarques importantes :

- Nom du dossier : Veuillez vous assurer que le dossier principal reste nommé URBANIA_APP et qu'il est placé sur le bureau.
- XAMPP : Pour l'installation automatique, XAMPP doit être lancé et le serveur SQL doit être actif.
- Dépannage : En cas de problème avec l'installation automatique, l'installation manuelle est obligatoire pour garantir le bon fonctionnement de l'application.

-------------------------------------------------------------

Suivez ces instructions dans l'ordre pour assurer une installation réussie de l'application. En cas de difficulté avec l'installation automatique, n'oubliez pas de procéder à l'installation manuelle.
