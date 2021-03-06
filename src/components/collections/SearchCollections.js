import React, { Component } from 'react';
import { Card, Col, Form, FormControl, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchCollections, clearFoundCollections, selectCollectionForEdit, searchRandomCollections } from '../../store/actions/collectionActions';

class SearchCollections extends Component {
    state = {
        searchField: '',
        collectionsFound: this.props.collectionsFound,
        errorMessage: null
    }

    handleChange = (e) => {
        this.setState({
            searchField: e.target.value
        })
    }

    handleSearch = (e) => {
        e.preventDefault();
        let collectionTitle = this.state.searchField;
        this.props.clearFoundCollections();
        this.props.searchCollections(collectionTitle);
        this.setState({
            collectionsFound: this.props.collectionsFound,
            errorMessage: this.searchError ? this.searchError : "No collections found."
        })
    }

    handleShowRandom = (e) => {
        e.preventDefault();
        this.props.clearFoundCollections();
        this.props.searchRandomCollections();
        this.setState({
            collectionsFound: this.props.collectionsFound,
            errorMessage: this.searchError ? this.searchError : "No collections found."
        })
    }

    handleDetails = (collection, authorId, comments, ratings) => (e) => {
        this.props.selectCollectionForEdit([collection.title, { movies: collection.movies, privacy: collection.privacy, authorId, comments, ratings }])
    }

    render() {
        const { collectionsFound, searchError, auth } = this.props;
        const collectionList = collectionsFound.map(collection => {
            return (
                <Card style={{ marginTop: '20px' }} key={`${collection.title}${collection.authorId}`}>
                    <Card.Header style={{ fontSize: '20px' }}>{collection.title} <span className="float-right">By: {collection.authorFirstName} {collection.authorLastName}</span></Card.Header>
                    <Card.Body>
                        {collection.movies.length} movies in collection
                        </Card.Body>
                    <Card.Footer>
                        {auth.uid && auth.uid != collection.authorId ?
                            <span>
                                <Link to="/rateCollection" onClick={this.handleDetails(collection, collection.authorId, collection.comments, collection.ratings)} className="btn btn-outline-secondary" style={{ marginRight: "10px" }}>Rate</Link>
                                <Link to="/commentCollection" onClick={this.handleDetails(collection, collection.authorId, collection.comments, collection.ratings)} className="btn btn-outline-secondary">Comment</Link>
                            </span>
                            :
                            null
                        }
                        <Link onClick={this.handleDetails(collection, collection.authorId, collection.comments, collection.ratings)} to="/collectionDetails" className="btn btn-outline-success float-right">{auth.uid == collection.authorId ? "Edit" : "Inspect"}</Link>
                    </Card.Footer>
                </Card>
            )
        })
        return (
            <Col>
                <Card style={{ marginRight: "50px", marginLeft: "20px" }}>
                    <Card.Header style={{ fontSize: "30px" }}>Collections</Card.Header>
                    <Card.Body>
                        <Form inline className="justify-content-between" onSubmit={this.handleSearch}>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.handleChange} />
                            <span>
                                <Button style={{ marginRight: "10px"}} type="button" variant="outline-primary" onClick={this.handleSearch}>Search</Button>
                                <Button type="button" variant="outline-primary" onClick={this.handleShowRandom}>Show random</Button>
                            </span>
                        </Form>
                        {collectionsFound.length > 0 ?
                            collectionList
                            :
                            this.state.errorMessage ?
                                <Alert variant="danger" style={{ marginTop: "15px", marginBottom: "0" }}>{this.state.errorMessage}</Alert>
                                :
                                null
                        }
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchError: state.collection.searchError,
        collectionsFound: state.collection.collectionsFound,
        user: state.firebase.profile,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearFoundCollections: () => dispatch(clearFoundCollections()),
        searchCollections: (collectionTitle) => dispatch(searchCollections(collectionTitle)),
        searchRandomCollections: () => dispatch(searchRandomCollections()),
        selectCollectionForEdit: (collection) => dispatch(selectCollectionForEdit(collection))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCollections);