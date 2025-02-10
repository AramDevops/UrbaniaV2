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
 │    │    ├── 📂 venv


Useful Commands :

# activer le venv :
.\venv\Scripts\Activate.ps1 

# generate the requirements
pip freeze > requirements.txt

#install the requirements if generated
python -m pip install -r requirements.txt

