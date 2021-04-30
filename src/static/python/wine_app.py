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

#creating an app
app = Flask(__name__)


#Homepage
@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/all')
def all():
    session = Session(engine)
    wine_all = engine.execute("Select wine_final.title, wine_final.winery, wine_final.latitude, wine_final.longitude from wine_final").fetchall()
    
    wine_list = []
    for items in wine_all:
        wine_dict = {}
        wine_dict['title']  = items[0]
        wine_dict['winery'] = items[1]  
        wine_dict["latitude"] = items[2]
        wine_dict["longitude"]    = items[3]
        wine_list.append(wine_dict)
    session.close()
    return (jsonify({'Wine': wine_list, 'Count': len(wine_list)}))

@app.route('/variety_count')
def variety_count():
    session = Session(engine)
    # wine_all = engine.execute("select Variety.variety, Variety.variety_count, Variety.winery_count, Variety.vintage_low, Variety.vintage_high from Variety").fetchall()
    wine_all = engine.execute("select wine_count.variety, wine_count.variety_count, wine_count.winery_count, wine_count.vintage_low, wine_count.vintage_high from wine_count ").fetchall()

    wine_list = []
    for items in wine_all:
        wine_dict = {}
        wine_dict['variety']  = items[0]
        wine_dict['variety_count'] = items[1]  
        wine_dict["winery_count"] = items[2]
        wine_dict["vintage_low"]    = items[3]
        wine_dict["vintage_high"]    = items[4]
        wine_list.append(wine_dict)
    session.close()
    return (jsonify({'Variety Count': wine_list, 'Count': len(wine_list)}))


@app.route('/variety/<variety>')
def variety1(variety):
    session = Session(engine)

#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.variety =\'"+variety+"\'").fetchall()
    wines = engine.execute('''select wine_final.winery, wine_final.title, wine_final.variety, wine_final.street, 
    wine_final.city, wine_final.state, wine_final.zip, wine_final.latitude, wine_final.longitude, wine_final.points, wine_final.price
    from wine_final where wine_final.variety =\''''+variety+"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Variety'] = item[2]
        wine_dict['Address'] = item[3] + ' ' + item[4] + ', ' + item[5] + ' ' + item[6]
        wine_dict['Latitude'] = item[7]
        wine_dict['Longitude'] = item[8]
        wine_dict['Rating'] = item[9]
        wine_dict['Price'] = item[10]


        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    session.close()
    response = jsonify({'Variety': wine_list, 'Count': len(wine_list)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



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

    wines = engine.execute("select wine_final.winery, wine_final.title, wine_final.variety, wine_final.points, wine_final.price from wine_final where wine_final.variety =\'"+variety+"\' and wine_final.points>=\'"+points_low+"\'and wine_final.price<=\'"+price_high+"\'and wine_final.price>=\'"+price_low+"\'").fetchall()

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
    session.close()

    return (jsonify({'Variety': wine_list, 'Count': len(wine_list)}))

@app.route('/tasters/<variety>')
def tasters1(variety):
    session = Session(engine)

    wines = engine.execute("select wine_final.taster_name, wine_final.title, wine_final.variety from wine_final where wine_final.taster_name is not NULL and wine_final.variety =\'"+variety+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Taster'] = item[0]
        wine_dict['Title'] = item[1]
        wine_dict['Variety'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    session.close()

    return (jsonify({'Tasters': wine_list, 'Count': len(wine_list)}))

@app.route('/price/<price>')
def price1(price):
    session = Session(engine)
    
    price_low=str(round(int(price)*.90))
    price_high=str(round(int(price)*1.10))
    
    print(price_low)
    print(price)
    print(price_high)

    wines = engine.execute("select wine_final.winery, wine_final.title, wine_final.variety, wine_final.points, wine_final.price from wine_final where wine_final.price<=\'"+price_high+"\'and wine_final.price>=\'"+price_low+"\'").fetchall()

    
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
    session.close()

    return (jsonify({'Vintages': wine_list, 'Count': len(wine_list)}))


@app.route('/vintage/<vintage>')
def vintage1(vintage):
    session = Session(engine)

    wines = engine.execute("select wine_final.winery, wine_final.title, wine_final.vintage from wine_final where wine_final.vintage =\'"+vintage+"\'").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Vintage'] = item[2]

        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    session.close()

    return (jsonify({'Vintages': wine_list, 'Count': len(wine_list)}))

@app.route('/winery/<winery>')
def winery1(winery):
    session = Session(engine)

    wines = engine.execute('''select wine_final.winery, wine_final.title, wine_final.points, wine_final.price from wine_final where wine_final.winery 
    =\'''' +winery+"\' order by wine_final.points DESC").fetchall()
#    wines = engine.execute("select Wine.winery, Wine.title from Wine where Wine.winery =\'"Aaron"\'").fetchall()
    
    wine_list = []
    for item in wines:
        wine_dict = {}
        wine_dict['Winery'] = item[0]
        wine_dict['Wine'] = item[1]
        wine_dict['Rating'] = item[2]
        wine_dict['Price'] = item[3]



        wine_list.append(wine_dict)
        
    #final_quotes_list = ['quotes': quotes_list]
    session.close()
    response = jsonify({'wineries': wine_list, 'count': len(wine_list)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    app.run(debug=True)