module PathHelpers
  def category_path(category)
    if category.slug == 'portraits'
      '/index.html'
    else
      "/categories/#{category.slug}/index.html"
    end
  end
end
