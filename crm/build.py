from django.shortcuts import render_to_response
from crm.models import *
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.http import HttpResponse


def profile(user):
	p = Profile.objects.get(username = user.username)
	return p


def game(request, name):
	user = None
	if request.user.is_authenticated():
		user = profile(request.user)
	game = Game.objects.get(asset_dir = name)
	return render_to_response('buildgame.html', {'user':user, 'game':name, 'url':'/site_media/assets/' + game.asset_dir + '/game.xml'})
