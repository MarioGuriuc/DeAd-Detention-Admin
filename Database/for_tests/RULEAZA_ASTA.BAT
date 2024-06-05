py -m venv venv

cd venv\Scripts

CALL activate.bat

cd ..\..

pip install -r req.txt

py populate.py