from django.shortcuts import render_to_response
from crm.models import *
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.forms import ModelForm

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
			return HttpResponseRedirect('/')
	else:
		form=NewUserForm()
	return render_to_response('form.html',{'form':form,})

