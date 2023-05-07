# MNIST Demo

Simple MNIST demo for machine learning practice.

Model is built with pytorch, and UI is build with solid-js.

# Building

Create a python virtual environment with `python -m venv env`.
Activate the environment with
  - Windows CMD: `.\env\Scripts\activate.bat`
  - Windows Powershell: `.\env\Scripts\Activate.ps1`
  - Linux/MacOs: `source env/bin/activate`

Install dependencies with `pip install -r requirements.txt`.
Save modified dependencies with `pip freeze > requirements.txt`.

Run model.py with python to generate the model.

Use `pnpm run build` to build the project.

Build output is in the `docs` folder, which is hosted by github pages.