import subprocess
from datetime import datetime

# -- Project information -----------------------------------------------------

project = "yeti"
copyright = f"2022-{datetime.now().year}, mlml.com"
author = "mlml.com"

version = (
    subprocess.check_output(
        ["sh", "-c", "git describe --tags `git rev-list --tags --max-count=1`"]
    )
    .decode("utf-8")
    .strip()[1:]
)

# -- General configuration ---------------------------------------------------

source_suffix = [".rst", ".md"]

# See https://github.com/readthedocs/readthedocs.org/issues/2149
master_doc = "index"

# Sphinx extensions
extensions = [
    "sphinxext.opengraph",
    "sphinx.ext.autodoc",
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.napoleon",
    "sphinx.ext.todo",
    "sphinx.ext.viewcode",
    "sphinx.ext.ifconfig",
    "sphinx_click.ext",
    "sphinx_copybutton",
    "sphinx_design",
    "sphinx_issues",
    "sphinxcontrib.spelling",
    "myst_parser",
    "sphinx_inline_tabs",
    "sphinx_lfs_content",
]

# Plugin Configurations:
napoleon_google_docstring = True
napoleon_numpy_docstring = False
napoleon_include_special_with_doc = False
napoleon_attr_annotations = True
autodoc_typehints = "signature"
autodoc_typehints_format = "short"
autodoc_typehints_description_target = "documented"

autosectionlabel_prefix_document = True
autosectionlabel_maxdepth = 10

ogp_site_url = "http://docs.mlml.org"
ogp_image = "https://docs.mlml.org/en/latest/_static/img/mlml-banner.png"
ogp_site_name = "mlML Documentation"
ogp_use_first_image = True

issues_default_group_project = "mlml/yeti"

todo_include_todos = True

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# The name of the Pygments (syntax highlighting) style to use.
pygments_style = "zenburn"
pygments_dark_style = "monokai"

myst_enable_extensions = ["colon_fence"]

# Remove the prompt when copying examples
copybutton_prompt_text = r">>> |\.\.\.|» |\% |\$ |In \[\d*\]: | {2,5}\.\.\.: | {5,8}: "
copybutton_prompt_is_regexp = True
copybutton_line_continuation_character = "\\"
copybutton_here_doc_delimiter = "EOT"
copybutton_selector = "div:not(.no-copybutton) > div.highlight > pre"

# -- Options for HTML output -------------------------------------------------
html_theme = "furo"
html_theme_options = {
    "light_css_variables": {
        "color-brand-primary": "#44a4c6 ",
        "color-brand-content": "#44a4c6 ",
    },
    "dark_css_variables": {
        "color-brand-primary": "#c9378a ",
        "color-brand-content": "#c9378a ",
    },
    "source_repository": "https://github.com/mlml/yeti/",
    "source_branch": "main",
    "source_directory": "docs/source/",
    "footer_icons": [
        {
            "name": "GitHub",
            "url": "https://github.com/mlml/yeti",
            "html": " 🦄️ ",
            "class": "",
        },
    ],
}

html_title = "yeti"
html_logo = "_static/img/logo.svg"
html_static_path = ["_static"]
html_css_files = ["css/custom.css"]
html_js_files = ["js/custom.js"]
html_show_sphinx = False
html_favicon = "_static/img/favicon-96x96.ico"

# Private dictionary for spell checker
spelling_word_list_filename = ["yeti_wordlist.txt"]

# mock any heavy imports, eg: imports from frameworks library
autodoc_mock_imports = []

linkcheck_ignore = ["https://github.com/kubernetes-sigs/metrics-server#installation"]
linkcheck_allowed_redirects = {
    r"http[s]://docs\.aws\.amazon\.com/.*": r"http[s]://docs\.aws\.amazon\.com/.*",
    r"http[s]://docs\.mlml\.org/.*": r"http[s]://docs\.mlml\.org/en/latest/.*",
    r"http[s]://docs\.yeti\.io/.*": r"http[s]://docs\.yeti\.io/en/latest/.*",
    r"http://modelserving\.com(/.*)?": r"https://modelserving\.com/.*",
    r"https://l\.linklyhq\.com/.*": r"https://mlml\.slack\.com/.*",
}
