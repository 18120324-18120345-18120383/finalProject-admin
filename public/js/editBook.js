$('#editBookModal').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget) // Button that triggered the modal
  const name = button.data('name')
  let cover1 = button.data('firstcoverstring')
  let cover2 = button.data('secondcoverstring')
  let cover3 = button.data('thirdcoverstring')
  const coverType1 = button.data('firstcovertype')
  const coverType2 = button.data('secondcovertype')
  const coverType3 = button.data('thirdcovertype')
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

  modal.find('.modal-body #imgCover1').html(`
      <img src='data:`+ coverType1 + `;charset=utf-8;base64,` + cover1 + `' alt="Cover1" style="width: 200px; heigh: 200px; margin: auto">
    `)
  modal.find('.modal-body #imgCover2').html(`
      <img src='data:`+ coverType2 + `;charset=utf-8;base64,` + cover2 + `' alt="Cover2" style="width: 200px; heigh: 200px; margin: auto">
    `)
  modal.find('.modal-body #imgCover3').html(`
      <img src='data:`+ coverType3 + `;charset=utf-8;base64,` + cover3 + `' alt="Cover3" style="width: 200px; heigh: 200px; margin: auto">
    `)
})