$('#editModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget) // Button that triggered the modal
    const name = button.data('name')
    const cover1 = button.data('firstcover')
    const cover2 = button.data('secondcover')
    const cover3 = button.data('thirdcover')
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
    modal.find('.modal-body #InputCover1').val(cover1)
    modal.find('.modal-body #InputCover2').val(cover2)
    modal.find('.modal-body #InputCover3').val(cover3)
    modal.find('.modal-body #InputCategory').val(category)
    modal.find('.modal-body #InputPrice').val(price)
    modal.find('.modal-body #InputDescription').val(description)
  })