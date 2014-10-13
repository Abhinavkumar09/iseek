from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import random
import os

# User profile
class Profile(User):
	def save(self, *args, **kwargs):
		#self.set_password(self.username)
		self.set_unusable_password()
		self.username = self.first_name + self.last_name + str(random.randrange(10000,99999))
		super(Profile, self).save(*args, **kwargs)


# Game
class Game(models.Model):
	name = models.CharField(max_length=100)
	asset_dir = models.CharField(max_length=100)

	def save(self, *args, **kwargs):
		mydir = os.path.join(settings.ROOT_PATH, '../site_media/assets', self.asset_dir)
		if not os.path.exists(mydir):
			os.mkdir(mydir)
		super(Game, self).save(*args, **kwargs)



#Modes of Learning
class MOL(models.Model):
	name = models.CharField(max_length=100)

class Certificate(models.Model):
	game = models.ForeignKey("Game")
	name = models.CharField(max_length=100)
	icon = models.CharField(max_length=100)
	isFinished = models.BooleanField()
	date = models.DateField()


class CertificateElement(models.Model):
	certificate = models.ForeignKey("Certificate")
	name = models.CharField(max_length=100)
	icon = models.CharField(max_length=100)
	mode_of_learning = models.ForeignKey("MOL")
	isFinished = models.BooleanField()
	date = models.DateField()
	

class Classroom(MOL):
	lesson_seq = models.CharField(max_length=1000, help_text="blah")
	

class Aanganbaadi(MOL):
	lesson_seq = models.CharField(max_length=1000, help_text="blah")


class Guru(MOL):
	lesson_seq = models.CharField(max_length=1000, help_text="blah")


class VirtualWorld(MOL):
	lesson_seq = models.CharField(max_length=1000, help_text="blah")

