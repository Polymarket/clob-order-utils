.PHONY: build
build:
	@echo "Building ts code..."
	rm -rf dist
	tsc

.PHONY: test
test:
	NODE_OPTIONS="--experimental-transform-types" pnpm nyc -a \
		--reporter=html \
		--reporter=text mocha './tests' \
		--require jsdom-global/register \
		'tests/**/*.test.ts' \
		--timeout 10000 \
		--exit

.PHONY: lint
lint:
	@echo "Linting code..."
	./node_modules/.bin/eslint ./src --ext .js,.ts
