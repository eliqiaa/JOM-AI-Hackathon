"""Project paths + settings. Single source of truth so tests and ingest agree."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_PROCESSED = REPO_ROOT / "data" / "processed"
CHROMA_PERSIST_DIR = REPO_ROOT / "chroma_db"
BM25_INDEX_PATH = REPO_ROOT / "bm25_index.pkl"

CHROMA_COLLECTION_NAME = "digital_oth_services"
# Local sentence-transformers model bundled with chromadb via onnxruntime.
# Zero-cost, no API key, runs on CPU. Phase 6 may layer an LLM reranker on
# top that needs OPENAI_API_KEY — kept optional in Settings below.
LOCAL_EMBEDDING_MODEL = "all-MiniLM-L6-v2"


class Settings(BaseSettings):
    """Reads .env if present. All fields optional — Phase 2 ingest needs none.
    Phase 6 reranker will read `openai_api_key`.
    """

    openai_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=REPO_ROOT / ".env", extra="ignore")
