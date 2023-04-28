build:
	RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release

clear-dev-account:
	rm -rf ./neardev

dev-deploy: build clear-dev-account
	set -e; \
	WASM_PATH="./target/wasm32-unknown-unknown/release/marketplace.wasm"; \
	near dev-deploy \
		--wasmFile $$WASM_PATH; \
	near call "$$(<./neardev/dev-account)" new \
		--accountId "$$(<./neardev/dev-account)";
