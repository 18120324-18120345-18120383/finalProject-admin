$('#editBookModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget) // Button that triggered the modal
  const name = button.data('name')
  const category = button.data('category')
  const categoryID = button.data('categoryid')
  const price = button.data('price')
  const description = button.data('description')
  const id = button.data('id')
  // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  const modal = $(this)
  modal.find('.modal-body #bookID').val(id)
  modal.find('.modal-body #categoryID').val(categoryID)
  modal.find('.modal-body #InputName').val(name)
  modal.find('.modal-body #InputCategory').val(category)
  modal.find('.modal-body #InputPrice').val(price)
  modal.find('.modal-body #InputDescription').val(description)

  $.getJSON('/api/find-cover-by-id', { id }, (data) => {
    let coversString = data.coversString;
    modal.find('.modal-body #imgCover1').html(`
      <img src=`+ coversString[0] +` name="cover1" alt="Cover1" style="width: 200px; heigh: 200px; margin: auto">
    `)
    modal.find('.modal-body #imgCover2').html(`
      <img src=`+ coversString[1] +` name="cover2" alt="Cover2" style="width: 200px; heigh: 200px; margin: auto">
    `)
    modal.find('.modal-body #imgCover3').html(`
      <img src=`+ coversString[2] +` name="cover3" alt="Cover3" style="width: 200px; heigh: 200px; margin: auto">
    `)
  })
})
