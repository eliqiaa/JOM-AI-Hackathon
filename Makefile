# Digital OTH — convenience targets.
# Windows users: use `python -m src.<target>` directly, or run via WSL.

.PHONY: ingest test eval eval-json

ingest:
	python -m src.ingest

test:
	pytest -v

eval:
	python -m src.evaluate

eval-json:
	python -m src.evaluate --json
