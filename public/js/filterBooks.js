const btnFilterBook = document.getElementById('btnFilterBook')
const category = document.getElementById('filterCategory')
const name = document.getElementById('filterName')
const minPrice = document.getElementById('filterMinPrice')
const maxPrice = document.getElementById('filterMaxPrice')
const bodyBooksTable = document.getElementById('bodyBooksTable')

btnFilterBook.onclick = () => {
    let filterCategory = category.value;
    let filterMaxPrice = maxPrice.value;
    let filterMinPrice = minPrice.value;
    let filterName = name.value;
    $.getJSON('/api/all-books', {}, (data) => {
        let books = [];
        data.forEach(book => {
            if (filterCategory != ""){
                if (book.category != filterCategory){
                    return;
                }
            }
            if (filterMinPrice != ""){
                if (book.basePrice < filterMinPrice){
                    return;
                }
            }
            if (filterMaxPrice != ""){
                if (book.basePrice > filterMaxPrice){
                    return;
                }
            }
            if (filterName != "") {
                if (!book.name.includes(filterName)){
                    return;
                }
            }
            books.push(book);
        });

        let table = $('#booksTable').DataTable();
        table.destroy();
        table.draw();

        bodyBooksTable.innerHTML = ''
        books.forEach(book => {
            bodyBooksTable.insertAdjacentHTML('beforeend', `
            <tr>
              <td>`+book.name+`</td>
              <td>`+book.category+`</td>
              <td>`+book.basePrice+`</td>
              <td>
                <div class="d-flex justify-content-center">
                  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editBookModal"
                    data-id=`+book._id+` data-name="`+book.name+`" data-firstcover=`+book.cover[0]+`
                    data-secondcover=`+book.cover[1]+` data-thirdcover=`+book.cover[2]+` data-category="`+book.category+`"
                    data-categoryid=`+book.categoryID+` data-price=`+book.basePrice+` data-description="`+book.description+`">
                    Edit
                  </button>
                </div>
              </td>
            </tr>`) 
        });
        
        $(document).ready(function() {
            $('#booksTable').DataTable();
          });
    });
}