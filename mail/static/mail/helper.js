function rowDisappear (id){
    let row = document.querySelector(`#archiveOnRow${id}`);
 
    row.addEventListener('click', function(){
      console.log(this);
      this.parentNode.parentNode.style.webkitAnimationPlayState="running";
      this.parentNode.parentNode.addEventListener('animationend', function(){
        this.remove();
      })

      }
    )
}