import {html, css, LitElement} from 'lit';
import { until } from 'lit/directives/until.js';
import flexsearch from 'flexsearch'
import {dotNotate, getSupportedLanguages, getReadableLanguage, getClosestLanguageMatch, containsHTML, containsLiquidInterpolation, createLiquidTranslationString} from './utils.js'

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';

export class LocalesApp extends LitElement {
  static styles = css`
    .container {
      max-width: 720px; 
      margin: 0 auto;
      padding: 0 var(--sl-spacing-medium);
    }

    .input-group {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
    }

    .input-group > * {
      flex-grow: 1;
      align-content: stretch;
      margin-right: var(--sl-spacing-medium);
      margin-top: var(--sl-spacing-medium);
    }

    @media (max-width: 600px) {
      .input-group {
        flex-wrap: wrap;
      }

      .input-group > * {
        margin-right: 0;
        margin-top: var(--sl-spacing-medium);
      }
    }

    

    .input-group > *:last-child {
      margin-right: 0;
    }

    .input-group: {
      display: flex; 
    }

    .search-results__list {
      margin: var(--sl-spacing-medium) 0;
      padding: 0
    }

    .search-results__list-item {
      display: flex;
      align-items: center;
      padding: var(--sl-spacing-small) var(--sl-spacing-medium);
      border-bottom-width: 0.5px;
      border-bottom-style: solid;
      border-bottom-color: var(--sl-color-neutral-200);
    }

    .search-results__list-item:last-child {
      border-bottom: none;
    }

    .search-results__list-item-content {
      flex: 1;
    }

    .search-results__list-item-actions {
      margin-left: var(--sl-spacing-medium);
    }

    .search-results__list-item p {
      margin: var(--sl-spacing-small) 0;
    }

    .search-results__list-item-type {
      margin-left: var(--sl-spacing-medium);
    }

    .search-results__list-item:hover {
      background-color: var(--sl-color-neutral-100);
    }

    .highlight {
      background-color: var(--sl-color-primary-100);
      font-weight: bold;
    }

  `

  static properties = {
    query: {type: String},
    language: {type: String},
    repo: {type: String},
    initialized: {type: String}
  }

  constructor() {
    super()
    
    this.initialized = null;
    this.repo = "archetype-themes/locales";
    this.query = ''
  }

  async getConfig() {
    const url = `locales.config.json`
    const resp = await fetch(url)
    return await resp.json()
  }

  async init(repo) {
    this.initialized = 'pending';
    if (!this.config) {
      this.config = await this.getConfig()
    }

    this.language = this.defaultCode;
    this.locales = await this.getLocales(this.repo)

    this.flexsearch = this.createSearchIndex(this.index);
    this.results = []
    this.initialized = 'done';
  }

  get storefrontLocaleCodes() {
    const {storefront} = this.config.repos.find(({repo}) => repo === this.repo)
    return storefront
  }

  get defaultCode() {
    const {defaultCode} = this.config.repos.find(({repo}) => repo === this.repo)
    return defaultCode
  }

  get index() {
    return this.locales[this.language]
  }

  createSearchIndex(index) {
    const search = new flexsearch.Index({
      tokenize: "full",
      language: this.language
    })
    Object.entries(index).forEach(([key, value]) => search.add(key, value))
    return search
  }

  async getLocales () {
    const locales = {};

    await Promise.all(this.storefrontLocaleCodes.map(async (code) => {
      let filename = code;
      
      if (this.defaultCode === code) {
        filename += '.default'
      }

      filename += '.json';
      
      let url = this.repo === 'archetype-themes/locales' ?
        `locales/${filename}` :
        `https://raw.githubusercontent.com/${this.repo}/main/locales/${filename}`

      const resp = await fetch(url)
      locales[code] = dotNotate(await resp.json())
    }))
    return locales
  }

  getSearchResults(query) {
    let results = [];

    if (query === '') return results;

    return this.flexsearch.search(query);
  }

  optionsTemplate() {
    return this.storefrontLocaleCodes.map(code => html`<sl-option value="${code}">${getReadableLanguage(code)}</sl-option>`)
  }

  highlightText(text, searchTerm) {
    const re = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(re);

    return parts.map(part => part.toLowerCase() === searchTerm.toLowerCase() 
        ? html`<span class="highlight">${part}</span>` 
        : html`<span>${part}</span>`);
  }

  resultsTemplate(query) {
    const results = this.getSearchResults(query);

    const listItems = results.map(key => {
      const value = this.index[key];
      const highlightedText = this.highlightText(value, query)

      const tags = []

      if (containsHTML(value)) {
        tags.push(html`
          <sl-tooltip content="This translation contains HTML">
            <sl-tag size="small">HTML</sl-tag>
          </sl-tooltip>
        `)
      }

      if (containsLiquidInterpolation(value)) {
        tags.push(html`
          <sl-tooltip content="This translation interpolated values">
            <sl-tag size="small">Interpolation</sl-tag>
          </sl-tooltip>
        `)
      }

      const languageTags = []
      for (const code of this.storefrontLocaleCodes) {
        if (typeof this.locales?.[code][key] !== 'undefined') {
          languageTags.push(html`
            <sl-tooltip content="${`This translation is available in ${getReadableLanguage(code)}`}">
              <sl-tag size="small">${code}</sl-tag>
            </sl-tooltip>
          `)
        }
      }

      return html`
        <li 
          class="search-results__list-item"
          data-value="${value}"
          data-key="${key}"
        >
          <div class="search-results__list-item-content">
            <p>${highlightedText}</p>
            <p>
              <!-- <span>Languages: ${languageTags}</span> -->
              <!-- ${tags.length ? html`<span>Type: ${tags}</span>` : ''} -->
          </div>
          <div class="search-results__list-item-actions">
            <sl-copy-button 
              success-label="Copied liquid to clipboard"
              value="${createLiquidTranslationString(value, key)}"
            ></sl-copy-button>
          </div>
        </li>
      `
    })

    if (listItems.length) {
      return html`
        <ul class="search-results__list">
          ${listItems}
        </ul>
      `
    } else {
      return ''
    }
  }

  get repoLink() {
    const {directory} = this.config.repos.find(({repo}) => repo === this.repo)
    return directory
  }

  mainContent () {
    return html`
      <div class="container">
        <h1 style="text-align: center;">Locales Detective</h1>
        <p style="text-align: center;">Add <a href="${this.repoLink}">JSON files</a> to your theme. Search for translations. Copy Liquid to your clipboard!</p>
        <sl-input 
          placeholder="Search..."
          size="large"
          @sl-input="${(e) => this.query = e.target.value}"
          pill
          filled
          clearable
        ></sl-input>

        <div class="input-group">
          <div>
            <sl-select
              size="small"
              value="${this.repo}" 
              @sl-change="${(e) => {
                  this.initialized = null;
                  this.results = [];
                  this.repo = e.target.value;
                }}" 
              pill
            >
              ${this.config.repos.map(({repo}) => html`<sl-option value="${repo}">${repo}</sl-option>`)}
            </sl-select>
          </div>
          <div>
            <sl-select 
              size="small"
              value=${this.language} 
              @sl-change="${(e) => this.language = e.target.value}" 
              pill
            >
              ${this.optionsTemplate()}
            </sl-select>
          </div>
        </div>

        ${this.resultsTemplate(this.query)}
      </div>
    `
  }

  placeholderContent () {
    return html`
      <h1 style="text-align: center;">Locales Detective</h1>
      <p style="text-align: center;">Add <a href="#">JSON files</a> to your theme. Search for translations. Copy Liquid to your clipboard!</p>
      <div class="container">
        <sl-input 
          placeholder="Search for some translations..."
          size="large"
          pill
          filled
          disabled
        ></sl-input>

        <div class="input-group">
          <div>
            <sl-select
              size="small"
              placeholder="${this.repo}" 
              pill
            >
            </sl-select>
          </div>
          <div>
            <sl-select 
              size="small"
              placeholder="English (en)" 
              pill
            >
            </sl-select>
          </div>
        </div>
      </div>
    `
  }

  render() {
    if (this.initialized !== 'done') {
      if (this.initialized !== 'pending') {
        this.init()
      }
      return this.placeholderContent()
    } else {
      return this.mainContent()
    }
  }
}

customElements.define('locales-app', LocalesApp)

