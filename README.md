Operating System Final Project
=======

# Installation Guide
## Prerequisite
Please make sure you have below programs installed.
1. NPM and [Node.js](https://nodejs.org/en/)(version 8)
2. [Python3](https://www.python.org/downloads/) (we use python3.6)

## Set up local development environment
1. Make a directory and setup a python virtual environment.
```shell
mkdir <your-directory-name>
cd <your-directory-name>

// I use virtualenv. This is not a requirement really. Just make
// sure you dont mess with your local environment.

virtualenv env
source env/bin/activate
```
2. Clone the project.
```
git clone git@github.com:Honesty1997/OS-2018-Fall-Final-Project.git

// or use https
git clone https://github.com/Honesty1997/OS-2018-Fall-Final-Project.git
```

3. (optional)Change the project name since it is too long.
```
mv OS-2018-Fall-Final-Project <your-desired-name>
```
4. cd <your-desired-name>
5. install all python and node dependencies.
```
npm install
pip install -r requirements.txt
```
6. Start the server or directly run the python file.
```
// With this command, it will start a node server and spawn a python process from main.py.
// You should see some log.
node index.js

// With this command, just execute the python file only.
python3 main.py
```
