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
		print ids
		data = self.sock.execute(self.dbname, self.uid, self.pwd, model, 'read', ids, [])
		return data

	def unlink(self, model, ids):
		data = self.sock.execute(self.dbname, self.uid, self.pwd, model, 'unlink', ids)


#def add_product(name,std_price,listPrice):
#	product_template = {
#		'name': name,
#		'standard_price':std_price,
#		'list_price':listPrice,
#		'mes_type':'fixed',
#		'uom_id':1,
#		'uom_po_id':1,
#		#'type':'product',
#		'procure_method':'make_to_stock',
#		'cost_method':'standard',
#		'categ_id':1
#	}
#	template_id = client.create('product.template', product_template)
#	product_product = {
#		'product_tmpl_id':template_id,
#		'default_code': row[0],
#		'active': True,
#	}
#
#	product_id = client.create('product.product', product_product)


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


#def add_employee(request):
#	client = openERPClient()
#	data = request.GET
#	if(request.method == 'POST'):
#		data = request.POST
#	employee = {
#		'name' : request.GET['name'],
#		'work_phone' : request.GET['phone'],
#	}
#	parent_id = client.create('hr.employee', employee)

    
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

def add_invoice(request):
	#return HttpResponse(json.dumps(request), content_type="application/json")
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

	invoice  = {
	    'type': data['type'],
	    'state': data['state'],
#	    'origin': 'import xmlrpc',
	    'account_id': data['account_id'],          #balance sheet id
	    'date_invoice': date.today().strftime("%Y-%m-%d"),   # today

	    # Change the following each time:
	    'name' : data['name'],   # TBD
	    'partner_id': data['partner_id'],          # Customer
	    'address_invoice_id': data['address_invoice_id'],  # Address
	    'amount_total': data['amount_total'] 
    }

	print invoice
	#Don't know what to do here
	parent_id = client.create('account.invoice', invoice)
	print parent_id
	return HttpResponse(json.dumps({"id": parent_id}), content_type="application/json")

def get_invoice(request):
	client = openERPClient()
	data = request.GET
	if(request.method == 'POST'):
		data = request.POST

	invoice  = [
    	('name', '=', data['name'])   # TBD 
    ]
	data = client.search('account.invoice', invoice)
	return HttpResponse(json.dumps(data), content_type="application/json")

