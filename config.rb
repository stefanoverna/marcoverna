page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :url_root, 'https://www.marcoverna.photo'

ignore '/templates/*'

activate :directory_indexes
activate :pagination
activate :dato,
  token: ENV.fetch('DATOCMS_TOKEN'),
  base_url: 'https://www.marcoverna.photo',
  live_reload: true

activate :external_pipeline,
  name: :webpack,
  command: build? ?
    "./node_modules/webpack/bin/webpack.js --bail -p" :
    "./node_modules/webpack/bin/webpack.js --watch -d --progress --color",
  source: ".tmp/dist",
  latency: 1

configure :build do
  activate :minify_html
  activate :search_engine_sitemap,
    default_priority: 0.5,
    default_change_frequency: 'weekly'
end

configure :development do
  activate :livereload
end

require "lib/path_helpers"
helpers PathHelpers
include PathHelpers

dato.categories.each do |category|
  proxy(
    category_path(category),
    '/templates/category.html',
    locals: { category: category }
  )
end

