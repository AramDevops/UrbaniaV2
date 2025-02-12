-------------------------------------------------------------
Professeur/Auteur : Akram Nasr
Courriel : Akram.Nasr@cmontmorency.qc.ca
Cours : 420 4E6 MO - Analyse et conception de modèles
-------------------------------------------------------------

Architecture of the project : 

📂 Desktop
 ├── 📂 URBANIA_APP
 │    ├── 📜 mydatabase.sql  <-- ✅ SQL file 
 │    ├── 📜 setup_db.bat    <-- ✅ DB Script 
 │    ├── 📜 setup_app.bat   <-- ✅ App Script 

 │    ├── 📂 CafeUrbaniaV2
 │    │    ├── 📜 app.py     <-- ✅ Main App Code
 │    │    ├── 📜 requirements.txt
 │    │    ├── 📜 db.json
 │    │    ├── 📂 static
 │    │    ├── 📂 templates
 │    │    ├── 📂 venv <-- 👀 À créer !


Installation manuelle :
cd URBANIA_APP\CafeUrbaniaV2> 

# Créer le venv :
python -m venv venv 

# Activer le venv :
.\venv\Scripts\Activate.ps1 

# Install the requirements :
python -m pip install -r requirements.txt

# Run app :
python app.py



