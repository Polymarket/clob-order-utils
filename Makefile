.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	tsc

.PHONY: test
test:
	NODE_OPTIONS="--experimental-transform-types" yarn nyc -a \
		--reporter=html \
		--reporter=text mocha './tests' \
		--require jsdom-global/register \
		'tests/**/*.test.ts' \
		--require tsconfig-paths/register \
		--timeout 10000 \
		--exit

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts
