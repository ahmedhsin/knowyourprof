
<div align="center">
<h1 align="center">
<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
<br>know your professor
</h1>
<h3>◦ Developed with the software and tools below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/SVG-FFB13B.svg?style&logo=SVG&logoColor=black" alt="SVG" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style&logo=dotenv&logoColor=black" alt=".ENV" />
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style&logo=HTML5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/Jinja-B41717.svg?style&logo=Jinja&logoColor=white" alt="Jinja" />
<img src="https://img.shields.io/badge/React-61DAFB.svg?style&logo=React&logoColor=black" alt="React" />

<img src="https://img.shields.io/badge/Gunicorn-499848.svg?style&logo=Gunicorn&logoColor=white" alt="Gunicorn" />
<img src="https://img.shields.io/badge/Python-3776AB.svg?style&logo=Python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/Lodash-3492FF.svg?style&logo=Lodash&logoColor=white" alt="Lodash" />
<img src="https://img.shields.io/badge/Markdown-000000.svg?style&logo=Markdown&logoColor=white" alt="Markdown" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style&logo=JSON&logoColor=white" alt="JSON" />
<img src="https://img.shields.io/badge/Flask-000000.svg?style&logo=Flask&logoColor=white" alt="Flask" />
</p>
<img src="https://img.shields.io/github/languages/top/ahmedhsin/knowyourprof?style&color=5D6D7E" alt="GitHub top language" />
<img src="https://img.shields.io/github/languages/code-size/ahmedhsin/knowyourprof?style&color=5D6D7E" alt="GitHub code size in bytes" />
<img src="https://img.shields.io/github/commit-activity/m/ahmedhsin/knowyourprof?style&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/license/ahmedhsin/knowyourprof?style&color=5D6D7E" alt="GitHub license" />
</div>

---

## 📖 Table of Contents
- [📖 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [📂 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
    - [🔧 Installation](#-installation)
    - [🤖 Running knowyourprof](#-running-knowyourprof)

---


## 📍 Overview

**Know Your Professor** is a web-based platform that empowers students and academic communities by providing insights into professors and their reviews. It serves as a bridge between students and professors, offering a valuable resource for making informed decisions about educational experiences.

---


## 📂 Repository Structure
- **app/**
  - **api/**
    - __init__.py
    - **models/**
    - **views/**
  - database.db
  - __init__.py
- **bin/**
- **deploymenyConfig/**
  - (Deployment configuration files)
- **frontend/**
  - node_modules/
  - package.json
  - package-lock.json
  - public/
  - README.md
  - src/
    - App.js
    - assets/
    - components/
    - func/
    - index.js
    - routes/
  - ...
- README.md (Project documentation)
- requirements.txt (Python dependencies)
- run.py (Application entry point)







## 🚀 Getting Started

### 🔧 Installation

1. Clone the knowyourprof repository:
```sh
git clone https://github.com/ahmedhsin/knowyourprof
```

2. Change to the project directory:
```sh
cd knowyourprof
```

3. Install the dependencies:
```sh
pip install -r requirements.txt
cd frontend
npm install
```

### 🤖 Running knowyourprof backend

```sh
for development
python run.py
for production using gunicorn
gunicorn --access-logfile '-' --error-logfile '-' --bind 127.0.0.1:4000 run:app 
```

### 🤖 Running knowyourprof frontend

```sh
for development
npm run start

for production using node
npm run build
npm install -g serve  
serve -s build

for production using nginx
npm build
sudo apt-get install nginx
sudo mv frontend /var/nginx/www
sudo echo 'server {
    listen 80;
    server_name 0.0.0.0;
    root /var/www/frontend/build;
    index index.html index.htm;
    try_files $uri /index.html;
    location /api {
    	include proxy_params;
    	proxy_pass http://127.0.0.1:4000; #gunicorn bind
    }
}' > /etc/nginx/site-enabled/default
sudo systemctl restart nginx

```

