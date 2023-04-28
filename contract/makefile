build:
	cargo build --target wasm32-unknown-unknown --release

dev-deploy: build
	set -e; \
	WASM_PATH="./target/wasm32-unknown-unknown/release/marketplace.wasm"; \
	near dev-deploy \
		--wasmFile $$WASM_PATH; \
	near call "$$(<./neardev/dev-account)" new \
		--accountId "$$(<./neardev/dev-account)";
