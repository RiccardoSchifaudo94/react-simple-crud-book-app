import './App.css';
import React, {Component} from 'react';
import axios from 'axios';
import { Table,Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, InputGroup, FormGroup } from 'reactstrap';


class App extends Component {
  
  state = {
    books:[],
    newBookModal:false,
    newBookData:{
      title:'',
      rating:''
    },
    editBookData:{
      id:'',
      title:'',
      rating:''
    },
    enableUpdateBtn:false
  }

  componentDidMount(){
   this.loadBookList();
  }  

 toggleNewBookModal(){
   this.setState({newBookModal:!this.state.newBookModal, enableUpdateBtn:false});
 }
 
 loadBookList(){
  axios.get('http://localhost:3000/books').then((response)=>{
    this.setState({
      books:response.data
    });
  });
 }
 
 addBook(){
   axios.post('http://localhost:3000/books', this.state.newBookData).then((response)=>{
     
     let { books } = this.state;
     books.push(response.data);
     this.setState({books, newBookModal:false, newBookData:{ title:'',rating:''}});

   });
 }

 updateBook(id){
   //alert("update book = "+id);
   axios.get('http://localhost:3000/books/'+id).then((response)=>{
      //sconsole.log(response.data);
      let data = response.data;
      this.setState({newBookModal:!this.state.newBookModal,editBookData:{id:data.id},newBookData:{title:data.title,rating:data.rating},enableUpdateBtn:true});
   });
 }

 saveBook(){
  
   axios.put('http://localhost:3000/books/'+this.state.editBookData.id,this.state.newBookData).then((response)=>{
     //console.log(response.data);
     this.setState({enableUpdateBtn:false, newBookModal:!this.state.newBookModal,newBookData:{title:'',rating:''}});
     this.loadBookList();
   });
 }


 deleteBook(id){
   let x = window.confirm("Are you sure to delete this book?");
    
   if(x){
      axios.delete('http://localhost:3000/books/'+id).then((response)=>{
        //console.log(response.data);
        this.loadBookList();
      });
    }
 
  }

  render(){
        
        let books =  this.state.books.map((book)=>{
          return (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.rating}</td>
              <td>
                <Button color="success" size="sm" className="mr-2" onClick={()=>{this.updateBook(book.id);}}>Edit</Button>
                <Button color="danger" size="sm" onClick={()=>{this.deleteBook(book.id)}}>Delete</Button>
              </td>
            </tr>  
          )
        });

        return (
                <div className="App container">
                  <h1>Book App</h1>
                  <Button color="primary" className="my-3" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>
                  
                  <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
                          <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Modal title</ModalHeader>
                          <ModalBody>
                              <FormGroup>
                                <Label for="title">Title</Label>
                                <Input type="text" id="title" value={this.state.newBookData.title} onChange={(e)=>{
                                  
                                  let {newBookData} = this.state;
                                  
                                  newBookData.title = e.target.value;

                                  this.setState({newBookData});
                               
                               }}/>
                              </FormGroup>
                              <FormGroup>
                                <Label for="rating">Rating</Label>
                                <Input type="text" id="rating" value={this.state.newBookData.rating} onChange={(e)=>{
                                  
                                  let {newBookData} = this.state;

                                  newBookData.rating = e.target.value;
                                  
                                  this.setState({newBookData});

                                }}/>
                              </FormGroup>
                          </ModalBody>
                          <ModalFooter>
                          {
                            (this.state.enableUpdateBtn)
                              ?
                              (<Button color="info" onClick={()=>{this.saveBook()}}>Save book</Button>)
                              :
                              (<Button color="primary" onClick={this.addBook.bind(this)}>Add a new book</Button>)
                          }
                          <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                          </ModalFooter>
                    </Modal>
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Ranting</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {books}
                    </tbody>
                  </Table>
                </div>
        );
  }
}

export default App;
