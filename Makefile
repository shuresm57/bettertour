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

help:
	@echo 'To run the application, use the "make run" command. First time? run "make install". Need to reseed? Run "make seed"'.

.PHONY: install run seed
