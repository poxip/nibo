all: install
install:
	@echo "Be sure that You have installed: NodeJS and libiccu-dev!!!"
	npm install
	@echo "Patching node-irc module.."
	patch "./node_modules/irc/lib/irc.js" < "irc.js.patch"
	@echo "Done [OK]"
	
requirments:
	@echo "To run Nibo you have to have:"
	@echo "[x] - NodeJS Environment"
	@echo "[x] - libiccu-dev"
	@echo "[x] - Internet connection"
