from django.shortcuts import render_to_response
from crm.models import *
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.http import HttpResponse


# Manifest to be used for firefox app (not important right now)
def manifest(request):
	r =  render_to_response('firefox_manifest', {}, mimetype="application/x-web-app-manifest+json")
	return r


# Find profile associated with the user
def profile(user):
	p = Profile.objects.get(username = user.username)
	return p

# Show the main page
def index(request):
	user = None
	if request.user.is_authenticated():
		user = profile(request.user)
	else:
		return render_to_response('loginmenu.html', {})
	return render_to_response('index.html', {'user':user, 'games':Game.objects.all()})

# Show a game
def game(request, name):
	user = None
	if request.user.is_authenticated():
		user = profile(request.user)
	game = Game.objects.get(asset_dir = name)
	return render_to_response('game.html', {'user':user, 'game':name, 'url':'/site_media/assets/' + game.asset_dir + '/game.xml'})

# Show a game
def new_game(request):
	user = None
	if request.user.is_authenticated():
		user = profile(request.user)
	return render_to_response('new_game.html', {'user':user, })
