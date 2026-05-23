"""Tests for SG-specific acronym expansion."""

from __future__ import annotations

from src.acronyms import ACRONYMS, expand_acronyms


def test_passthrough_when_no_match():
    text = "The quick brown fox jumps over"
    assert expand_acronyms(text) == text


def test_appends_expansion_for_known_acronym():
    text = "I want HDB help"
    result = expand_acronyms(text)
    assert result.startswith(text + " ")
    assert "housing development board" in result.lower()


def test_case_insensitive_match():
    for variant in ["hdb", "Hdb", "HDB", "hDb"]:
        result = expand_acronyms(f"need {variant}")
        assert "housing development board" in result.lower(), variant


def test_word_boundaries():
    """`comcare` matches as a word but a longer compound like `bigcomcare` must not."""
    # word match
    assert "community care" in expand_acronyms("I need ComCare").lower()
    # no false match inside a larger word
    weird = "bigcomcaretomorrow"
    assert weird in expand_acronyms(weird)
    assert "community care" not in expand_acronyms(weird).lower()


def test_each_term_expanded_at_most_once():
    """Repeated occurrences don't compound the expansion."""
    text = "HDB HDB HDB"
    result = expand_acronyms(text)
    assert result.lower().count("housing development board") == 1


def test_multiple_distinct_acronyms_all_expanded():
    text = "I lost my MSF support and need WSG and HDB help"
    result = expand_acronyms(text).lower()
    assert "ministry of social and family development" in result
    assert "workforce singapore" in result
    assert "housing development board" in result


def test_singlish_terms():
    """Singlish verbs/particles are in the dict — confirm a couple match."""
    result = expand_acronyms("I kena retrenched last month").lower()
    assert "lose job" in result or "unemployed" in result
    assert "affected by" in result or "suffered" in result


def test_original_text_preserved_at_start():
    """The original text (including original casing) must come first, unmodified."""
    text = "I need HDB help"
    result = expand_acronyms(text)
    assert result.startswith(text)


def test_acronyms_dict_is_lowercase_keys():
    """Keys must be lowercase so case-insensitive lookup is consistent."""
    for key in ACRONYMS:
        assert key == key.lower(), f"non-lowercase key: {key!r}"
