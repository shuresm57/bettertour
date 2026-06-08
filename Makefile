install:
	cd client && npm install
	cd server && npm install
	@echo 'Dependencies installed successfully.'

run:
	cd client && npm run dev &
	cd server && npm run dev

seed:
	@echo 'Running seed for BetterTour'
	cd server && node src/database/seed.js

db:
	sqlite3 -cmd ".headers on" -cmd ".mode column" server/src/database/bettertour.db

help:
	@echo 'To run the application, use the "make run" command.'
	@echo 'First time? run "make install". Need to reseed? Run "make seed". Open the DB? Run "make db"'.

.PHONY: install run seed db
