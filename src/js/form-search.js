const searchOpener = document.getElementsByClassName('js-search-opener');

if(searchOpener.length > 0) {
    const searchForm = searchOpener[0].parentNode;
    const searchInput = searchForm.querySelector('.js-filter-search');

    searchOpener[0].onclick = function () {
        searchForm.classList.toggle("is-opened");
        searchInput.focus();
    };

    document.onclick = function(e){
        if(e.target.className !== 'js-search-opener' && !searchForm.contains(e.target)){
            searchForm.classList.remove("is-opened");
            searchInput.blur();
        }
    };

    searchInput.onblur = function() {
        searchForm.classList.remove("is-opened");
    };
}
