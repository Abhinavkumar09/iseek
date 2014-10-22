#!/usr/bin/env python


import xmlrpclib
import csv
import datetime
from datetime import date
import json

username = 'admin'  #the user
pwd = 'rohitj'  #the password of the user
dbname = 'iseek'    #the database

# Get the uid
sock_common = xmlrpclib.ServerProxy ('http://iseek.etal.in:8069/xmlrpc/common')
uid = sock_common.login(dbname, username, pwd)

#replace localhost with the address of the server
sock = xmlrpclib.ServerProxy('http://iseek.etal.in:8069/xmlrpc/object')

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
        print 'AAAAA'
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

#Function to create invoice on openERP system        
def createInvoice(request):
    data = request.POST['data']
    datalist = json.loads(data)
    for key, value in datalist.iteritems():
        if key == 'state':
            state = value
        elif key == 'name':
            name = value
        elif key == 'account_id':
            account_id= value
        elif key == 'partner_id':
            partner_id = value
        elif key == 'quantity':
            amount = value
        elif key == 'price':
            price = value
    invoice  = {
    'type': 'out_invoice',
    'state': state,
    'origin': 'import xmlrpc',
    'account_id': account_id,          #balance sheet id
    'date_invoice': date.today().strftime("%Y-%m-%d"),   # today

    # Change the following each time:
    'name' : name,   # TBD
    'partner_id': partner_id,          # Customer
    'address_invoice_id': partner_id,  # Address
    'amount_total': 0.00     
    }
    invoice_id = sock.execute(dbname, uid, pwd, 'account.invoice', 'create', invoice)
    print 'Invoice id=', invoice_id, 'added'
    return invoice_id

#Function to add lines to invoice 
def addLine(invoice_id,account_id,prod_name,prod_id,prod_price,prod_quantity):
    line1 = {
    'invoice_id': invoice_id,
    'account_id': account_id,     #Balance sheet id
    'name': prod_name,
    'product_id': prod_id,     # Product id     
    'price_unit': prod_price,  
    'quantity': prod_quantity
    }
    line_id = sock.execute(dbname, uid, pwd, 'account.invoice.line', 'create', line1)
    print 'Invoice line id=', line_id, 'added'
    
#Function to add a employee with a particular name and work phone number to the OpenERP system
def addEmployee(ename,workPhone):
    partner = {
        'name' : ename,
	'work_phone' : workPhone
    }
    parent_id = sock.execute(dbname, uid, pwd, 'hr.employee', 'create', employee)

        
#importProducts('categories.csv')
#expression =[('name', '=', 'FOL 100% CTTN JRSY')]
#data = getProducts(expression)
#print data
#addCustomer('testFunction')
#getCustomer('testFunction')
#invoice_id = createInvoice('paid',2,'SAJ/2014/0008',12)
#addLine(invoice_id,2,'FOL 100% CTTN JRSY',4,6.73,100)
#addEmployee('testFunction','9812983219')
