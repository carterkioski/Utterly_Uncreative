#import dependencies
from flask import Flask, jsonify,render_template
import numpy as np
import sqlalchemy
import psycopg2
from config import user, password
from sqlalchemy import inspect, create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import text

engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/Wine_DB') 
connection = engine.connect()
#Reflect an existing database and tables
Base = automap_base()
Base.prepare(engine, reflect=True)

#Save reference to the tables
# Wine = Base.classes.wine_final
# Authors = Base.classes.author
#creating an app
app = Flask(__name__)

#Homepage
@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/all')
def all_quotes():
    session = Session(engine)

    wine_all = engine.execute("Select Wine.title, Wine.winery, Wine.street, Wine.zip from Wine limit 100").fetchall()
    
    wine_list = []
    for items in wine_all:
        wine_dict = {}
        wine_dict['title']  = items[0]
        wine_dict['winery'] = items[1]  
        wine_dict["street"] = items[2]
        wine_dict["zip"]    = items[3]
        wine_list.append(wine_dict)
            
    return (jsonify({'Wine': wine_list, 'Count': len(wine_list)}))

    session.close()

@app.route('/variety/<variety>')
def variety1(variety):
    session = Session(engine)

#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.variety =\'"+variety+"\'").fetchall()
    wines = engine.execute("select Wine.winery, Wine.title, Wine.variety from Wine where Wine.variety =\'"+variety+"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Variety'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'Variety': wine_list, 'Count': len(wine_list)}))

    session.close()


@app.route('/options/<variety>/<points>/<price>')
def options1(variety,points,price):
    session = Session(engine)
    points_low=str(round(int(points)*.985))
    points_high=str(round(int(points)*1.025))
    
    print(points_low)
    print(points)
    print(points_high)

    price_low=str(round(int(price)*.90))
    price_high=str(round(int(price)*1.10))
    
    print(price_low)
    print(price)
    print(price_high)

    wines = engine.execute("select Wine.winery, Wine.title, Wine.variety, Wine.points, Wine.price from Wine where Wine.variety =\'"+variety+"\' and Wine.points>=\'"+points_low+"\'and Wine.price<=\'"+price_high+"\'and Wine.price>=\'"+price_low+"\'").fetchall()

    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Variety'] = item[2]
        wine_dict['Points'] = item[3]
        wine_dict['Price'] = item[4]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'Variety': wine_list, 'Count': len(wine_list)}))

    session.close()

@app.route('/tasters/<variety>')
def tasters1(variety):
    session = Session(engine)

    wines = engine.execute("select Wine.taster_name, Wine.title, Wine.variety from Wine where Wine.taster_name is not NULL and Wine.variety =\'"+variety+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Taster'] = item[0]
        wine_dict['Title'] = item[1]
        wine_dict['Variety'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'Tasters': wine_list, 'Count': len(wine_list)}))

    session.close()


@app.route('/price/<price>')
def price1(price):
    session = Session(engine)

    wines = engine.execute("select Wine.winery, Wine.title, Wine.price from Wine where Wine.price =\'"+price+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Price'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'Vintages': wine_list, 'Count': len(wine_list)}))

    session.close()



@app.route('/vintage/<vintage>')
def vintage1(vintage):
    session = Session(engine)

    wines = engine.execute("select Wine.winery, Wine.title, Wine.vintage from Wine where Wine.vintage =\'"+vintage+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Vintage'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'Vintages': wine_list, 'Count': len(wine_list)}))

    session.close()

@app.route('/winery/<winery>')
def winery1(winery):
    session = Session(engine)

    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"+winery+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]


        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    return (jsonify({'wineries': wine_list, 'count': len(wine_list)}))

    session.close()


if __name__ == "__main__":
    app.run(debug=True)