build:
	cargo build --target wasm32-unknown-unknown --release

deploy: build
	set -e
	WASM_PATH="$(find ./target/wasm32-unknown-unknown/release -maxdepth 1 -name '*.wasm')"
	near deploy \
		--wasmFile $WASM_PATH \
		-- accountId "$1" \
		--initFunction new

dev-deploy: build
	set -e
	WASM_PATH="$(find ./target/wasm32-unknown-unknown/release -maxdepth 1 -name '*.wasm')"
	near dev-deploy \
		--wasmFile $WASM_PATH \
		"$@"
	near call "$(<./neardev/dev-account)" new \
		--accountId "$(<./neardev/dev-account)"
