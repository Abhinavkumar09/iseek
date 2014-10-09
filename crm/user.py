from django.shortcuts import render_to_response
from crm.models import *
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.forms import ModelForm
from psycopg2 import connect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.conf import settings

class NewUserForm(ModelForm):
	def __init__(self, *args, **kwargs):
		super(NewUserForm, self).__init__(*args, **kwargs)
		self.fields['username'].help_text = ''
		

	class Meta:
		model=Profile
		help_texts=None
		exclude=("password", "is_staff", "is_active", "is_superuser", "last_login", "groups", "user_permissions", "email", "date_joined")



def newuser(request):
	if request.method=='POST':
		form=NewUserForm(request.POST)
		if form.is_valid():
			p = form.save()
			#print p.name
			#Change User and host accordingly. host must equal setting.OPENERP['url'], user must be a superuser that has permissions to create DATABASES
			#con = None
			#con = connect(dbname='postgres' user='SRS', host = 'localhost')
			#con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
			#cur = con.cursor()
			#cur.execute('CREATE DATABASE ' + p['username'] + 'erp TEMPLATE openerp_template')
			#cur.execute('CREATE USER ' + p['username'] + ' WITH PASSWORD ' + p['username'])
			#cur.execute('GRANT ALL PRIVILEGES ON ' + p['username'] + ' to ' + p['username']+ 'erp')
			#cur.close()
			#con.close()
			#openerpdb = p['username']+erp
			#openerppwd = p['username']
			#settings.OPENERP['username'] = openerppwd
			#settings.OPENERP['database'] = openerpdb
			#settings.OPENERP['password'] = openerppws
			return HttpResponseRedirect('/')
	else:
		form=NewUserForm()
	return render_to_response('form.html',{'form':form,})

