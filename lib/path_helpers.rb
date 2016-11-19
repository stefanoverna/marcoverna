module PathHelpers
  def category_path(category)
    if category.slug == 'overview'
      '/index.html'
    else
      "/categories/#{category.slug}/index.html"
    end
  end
end
