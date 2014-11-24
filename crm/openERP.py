import xmlrpclib
import datetime
from datetime import date
import json

from django.conf import settings
from django.http import HttpResponse

class openERPClient():
	def __init__(self):
		self.username = settings.OPENERP['username']  #the user
		self.pwd = settings.OPENERP['password']  #the password of the user
		self.dbname = settings.OPENERP['database']    #the database
		self.url = settings.OPENERP['url']

		# Get the uid
		self.sock_common = xmlrpclib.ServerProxy (self.url + '/xmlrpc/common')
		self.uid = self.sock_common.login(self.dbname, self.username, self.pwd)

		#replace localhost with the address of the server
		self.sock = xmlrpclib.ServerProxy(self.url + '/xmlrpc/object')


	def create(self, model, parameters):
		return self.sock.execute(self.dbname, self.uid, self.pwd, model, 'create', parameters)

	def edit(self, model, parameters, ids):
		return self.sock.execute(self.dbname, self.uid, self.pwd, model, 'write', ids, parameters)

	def search(self, model, parameters):
		ids = self.sock.execute(self.dbname, self.uid, self.pwd, model,'search', parameters)
		data = self.sock.execute(self.dbname, self.uid, self.pwd, model, 'read', ids, [])
		return data


def add_product(name,std_price,listPrice):
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
		'categ_id':1
	}
	template_id = client.create('product.template', product_template)
	product_product = {
		'product_tmpl_id':template_id,
		'default_code': row[0],
		'active': True,
	}

	product_id = client.create('product.product', product_product)


def read_employee(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

	employee = [
		('user_id', '=', data['name']),
	]
	data = client.search('hr.employee', employee)
	return HttpResponse(json.dumps(data), content_type="application/json")

def add_employee(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST
	employee = {
		'name' : request.GET['name'],
		'work_phone' : request.GET['phone'],
	}
	parent_id = client.create('hr.employee', employee)

    
def edit_employee(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

	employee = {
		'name': data['name'],
		'work_phone': data['phone'],
	}
	ids = [data['id']]
	parent_id = client.edit('hr.employee', employee, ids)

	return HttpResponse(json.dumps({"id": parent_id}), content_type="application/json")

def add_products(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST
	product = {
		'name' : data['name'],
		'list_price' : data['price'],
	}
	product_id = client.create('product.product', product)

	return HttpResponse(json.dumps({"id": product_id}), content_type="application/json")

def get_bom(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

        expr =[('product_qty','>','0')]
	data = client.search('mrp.bom', expr)
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def add_man_order(request):
	client = openERPClient()
	data = request.GET	
	if(request.method == 'POST'):
		data = request.POST
	manufacture_template = {
		'name': data['name'],
		'product_uom': data['uom'],
		'product_id': data['prod'],
		'bom_id': data['bom'],
		'location_src_id' : 12,
		'location_dest_id' : 12,
		'state': 'done',
		'product_qty': data['qty']

	}
	client.create('mrp.production', manufacture_template)

	return HttpResponse(json.dumps({ }), content_type="application/json")

def get_products(request):
    	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

        expr = [('standard_price','>','0')]
	data = client.search('product.product', expr)
	return HttpResponse(json.dumps(data), content_type="application/json")
