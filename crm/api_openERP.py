#!/usr/bin/env python


import xmlrpclib
import csv

username = 'admin'  #the user
pwd = 'test1'  #the password of the user
dbname = 'test5'    #the database

# Get the uid
sock_common = xmlrpclib.ServerProxy ('http://localhost:8069/xmlrpc/common')
uid = sock_common.login(dbname, username, pwd)

#replace localhost with the address of the server
sock = xmlrpclib.ServerProxy('http://localhost:8069/xmlrpc/object')

#load categories first
#Function to add products to the OpenERP system
def addProduct(name,std_price,listPrice):
    #reader = csv.reader(open(file,'rb'))
    #for row in reader:
        #print row[1]
        product_template = {
            'name': name,
            'standard_price':std_price,
            'list_price':listPrice,
            'mes_type':'fixed',
            'uom_id':1,
            'uom_po_id':1,
            #'type':'product',
            'procure_method':'make_to_stock',
            'cost_method':'standard',
            'categ_id':1}
        #print product_template
        template_id = sock.execute(dbname, uid, pwd, 'product.template', 'create', product_template)
        #print template_id

        product_product = {
            'product_tmpl_id':template_id,
            'default_code': row[0],
            'active': True,
        }

        product_id = sock.execute(dbname,uid,pwd,'product.product','create',product_product)
        #print product_product

    print "End product load"

#Function to get products from the openERP system. If no search expression is provided, it will return a list of all the products
def getProducts(expr=None):
    if expr is None:
        expr =[('standard_price','>','0')]
        temp = sock.execute(dbname,uid,pwd,'product.product','search',expr)
        fields = ['name','list_price']
        data = sock.execute(dbname,uid,pwd,'product.product','read',temp,fields)
        return data
    else:
        temp = sock.execute(dbname,uid,pwd,'product.product','search',expr)
        fields = ['name','list_price']
        data = sock.execute(dbname,uid,pwd,'product.product','read',temp,fields)
        return data

#Function to add a customer with a particular name to the OpenERP system
def addCustomer(name):
    partner = {
        'name' : name,
    }
    partner_id = sock.execute(dbname, uid, pwd, 'res.partner', 'create', partner)

#Function to get the details of a particular customer with a specific name    
def getCustomer(name):
    expr =[('name','=',name)]
    temp = sock.execute(dbname,uid,pwd,'res.partner','search',expr)
    print temp    
    fields = ['name']
    data = sock.execute(dbname,uid,pwd,'res.partner','read',temp,fields)
    print data

def getInvoice(expr=None):
    if expr is None:
        expr =[('amount_total','>','0')]
        temp = sock.execute(dbname,uid,pwd,'account.invoice','search',expr)
        fields = ['origin','currency_id']
        data = sock.execute(dbname,uid,pwd,'account.invoice','read',temp,fields)
        return data
    else:
        temp = sock.execute(dbname,uid,pwd,'account.invoice','search',expr)
        fields = ['origin','currency_id']
        data = sock.execute(dbname,uid,pwd,'account.invoice','read',temp,fields)
        return data
        
        
#addProduct('name',6.73,4.41)
#expression =[('name', '=', 'FOL 100% CTTN JRSY')]
#data = getProducts(expression)
#print data
#addCustomer('testFunction')
#getCustomer('testFunction')
