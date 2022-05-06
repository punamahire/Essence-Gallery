import React, { useState, useEffect, useReducer } from 'react';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { getPhotosByGalleryId, updatePhoto, getPhotoById, getPhotosWithKeywords } from "../../modules/PhotoManager"
import "./PhotoList.css"

export const PhotoList = () => {

    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [foundPhotos, setFoundPhotos] = useState([]);
    const [keywordsToSearch, setKeywordsToSearch] = useState("");
    const [photoSelected, setPhotoSelected] = useState({});
    const [isSelected, setIsSelected] = useState(false);
    const [keywordsToAdd, setKeywordsToAdd] = useState("");
    const [filteredImage, setFilteredImage] = useState("");

    const [value, toggleValue] = useReducer(previous => !previous, false);
    const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"));
    const { galleryId } = useParams();

    const getPhotosFromGallery = () => {
        // After the data comes back from the API, we
        // use the setGalleryPhotos function to update state
        return getPhotosByGalleryId(parseInt(galleryId)).then(photosFromAPI => {
            setGalleryPhotos(photosFromAPI)
        });
    };

    // update state with the search input user entered
    const handleControlledInputChange = (event) => {

        let keywordToSearch = event.target.value;
        setKeywordsToSearch(keywordToSearch);
    }

    // update state with the new keyword entered by the user
    const handleNewKeywordInput = (event) => {

        let enteredVal = event.target.value;
        setKeywordsToAdd(enteredVal);
    }

    // update states to identify which photo is selected 
    const imageSelected = (photoId) => {
        console.log("image clicked", photoId);

        getPhotoById(photoId).then(photoFromAPI => {
            setPhotoSelected(photoFromAPI);
            setIsSelected(true);
        })
    }

    // search the photos for the keywords entered
    const handleSearchPhotos = () => {
        console.log("inside handle search", keywordsToSearch);

        let searchResult = []
        galleryPhotos.map(photo => {

            if (photo.keywords?.match(new RegExp(keywordsToSearch.replace(' ', '|').replace(',', '|'), 'gi'))) {
                console.log("keyword found");
                searchResult.push(photo);
            }
        })
        setFoundPhotos(searchResult);

        // getPhotosWithKeywords(galleryId, keywordsToSearch).then(foundPics => {
        //     console.log("found pics", foundPics);
        //     setFoundPhotos(foundPics);
        // })
    }

    // add the keyword to the photo and update it in the database
    const handleAddKeywords = () => {
        console.log("keywordsToAdd", keywordsToAdd)

        // add keywords to the photo object and update it in the database 
        const editedPhoto = {
            imageUrl: photoSelected.imageUrl,
            galleryId: photoSelected.galleryId,
            userId: activeUser.id,
            keywords: keywordsToAdd,
            id: photoSelected.id
        };
        console.log("editedPhoto", editedPhoto)
        updatePhoto(editedPhoto).then(updatedPhoto => {
            console.log("updated photo", updatedPhoto);
        })
    }

    // apply selected image filter and show image preview.
    // apply the filter to the original photo from the 
    // gallery only when the user confirms filter application.
    const handleFilterPreview = (event) => {
        console.log("inside show filter preview", event);

        // filteredImage is a url of the photo with filter applied.
        // show filter preview on the original photo.
        if (filteredImage === "") {
            console.log("showing filter preview", filteredImage)
            setFilteredImage(photoSelected.imageUrl?.replace('/upload/', `/upload/e_art:${event.target.value}/`));
        }

        let previousFilter = "";
        if (filteredImage) {
            previousFilter = filteredImage.slice(':')[1];
            // change filter preview when user selects another filter from dropdown.
            if (previousFilter !== `${event.target.value}/`) {
                console.log("applying new filter", previousFilter);
                setFilteredImage(photoSelected.imageUrl?.replace('/upload/', `/upload/e_art:${event.target.value}/`));
            }
        }
    }

    // apply image filter to the selected photo from the gallery.
    // replace the original photo in the database with the filtered image.
    const handleApplyFilter = (event) => {
        console.log("inside apply filter", event);

        // filteredImage is the url of the image with filter applied
        const editedPhoto = {
            imageUrl: filteredImage,
            galleryId: photoSelected.galleryId,
            userId: activeUser.id,
            keywords: photoSelected.keywords,
            id: photoSelected.id
        };
        console.log("editedPhoto", editedPhoto)
        updatePhoto(editedPhoto).then(updatedPhoto => {
            console.log("updated photo", updatedPhoto);
        })
    }

    // got the photos from the gallery on the component's first render
    useEffect(() => {
        getPhotosFromGallery();
    }, []);

    return (
        <>
            {/* Display photos from the gallery in a 4 column grid */}
            <div className="container vh-100 overflow-auto">

                <div className="search-div">
                    <input className="search-input mr-sm-2" type="search" placeholder="Search photos" aria-label="Search"
                        id="keyword" onChange={(e) => handleControlledInputChange(e)} required autoFocus defaultValue={keywordsToSearch} />
                    <button className="btn btn-success my-2 my-sm-0" type="submit"
                        onClick={() => handleSearchPhotos()}>Search</button>
                </div>
                <div className="allPhotos-div">
                    {console.log("foundPhotos", foundPhotos)}
                    {foundPhotos.length > 0 ?
                        <Row>
                            {foundPhotos.map(photo => {
                                return (<div className="col-sm-3" key={photo.id}>
                                    <img style={{ width: 300 }} className={`${isSelected ? `selected-${photo.id}` : "not-selected"}`}
                                        src={photo.imageUrl} alt="3 column grid"
                                        onClick={() => imageSelected(photo.id)}></img>
                                </div>)
                            })
                            }
                        </Row>
                        :
                        <Row>
                            {galleryPhotos.map(photo => {
                                return (<div className="col-sm-3" key={photo.id}>
                                    <img style={{ width: 300 }} className={`${isSelected ? `selected-${photo.id}` : "not-selected"}`}
                                        src={photo.imageUrl} alt="3 column grid"
                                        onClick={() => imageSelected(photo.id)}></img>
                                </div>)
                            })
                            }
                        </Row>
                    }
                </div>
                <div>
                    <form>
                        <label className="form-label label-font-size" htmlFor="newKeyword">Add keywords</label>
                        <input type="text" id="newKeyword" onChange={(e) => handleNewKeywordInput(e)} required autoFocus
                            className="form-control" placeholder="Enter keywords" defaultValue={keywordsToAdd} />
                        <button className="btn btn-success my-2 my-sm-0" type="button"
                            onClick={() => handleAddKeywords()}>Add</button><br></br>

                        <label className="form-label label-font-size" htmlFor="layout">Image filters </label>
                        <select name="imageTrans" id="imageTrans" onChange={(e) => handleFilterPreview(e)} className="form-select" >
                            <option value="0">Select filter</option>
                            <option key='al_dente' value='al_dente'>al_dente</option>
                            <option key='athena' value='athena'>athena</option>
                            <option key='audrey' value='audrey'>audrey</option>
                            <option key='aurora' value='aurora'>aurora</option>
                            <option key='daguerre' value='daguerre'>daguerre</option>
                            <option key='eucalyptus' value='eucalyptus'>eucalyptus</option>
                            <option key='fes' value='fes'>fes</option>
                            <option key='frost' value='frost'>frost</option>
                            <option key='hairspray' value='hairspray'>hairspray</option>
                            <option key='hokusai' value='hokusai'>hokusai</option>
                            <option key='incognito' value='incognito'>incognito</option>
                            <option key='linen' value='linen'>linen</option>
                            <option key='peacock' value='peacock'>peacock</option>
                            <option key='primavera' value='primavera'>primavera</option>
                            <option key='quartz' value='quartz'>quartz</option>
                            <option key='red_rock' value='red_rock'>red_rock</option>
                            <option key='refresh' value='refresh'>refresh</option>
                            <option key='sizzle' value='sizzle'>sizzle</option>
                            <option key='sonnet' value='sonnet'>sonnet</option>
                            <option key='ukulele' value='ukulele'>ukulele</option>
                            <option key='zorro' value='zorro'>zorro</option>
                        </select>
                        Original: <img width="100" height="100" src={photoSelected.imageUrl} alt='original ' /><br></br>
                        Preview: <img width="100" height="100" src={filteredImage} alt='filtered' /><br></br>
                        <button className="btn btn-success my-2 my-sm-0" type="button"
                            onClick={() => handleApplyFilter()}>Apply this filter to the selected gallery image</button>
                    </form>
                </div>

            </div>
        </>
    );
}