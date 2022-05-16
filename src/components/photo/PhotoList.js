import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { getPhotosByGalleryId, updatePhoto, getPhotoById } from "../../modules/PhotoManager"
import "./PhotoList.css"

export const PhotoList = () => {

    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [foundPhotos, setFoundPhotos] = useState([]);
    const [keywordsToSearch, setKeywordsToSearch] = useState("");
    const [photoSelected, setPhotoSelected] = useState({});
    const [isSelected, setIsSelected] = useState(false);
    const [keywordsToAdd, setKeywordsToAdd] = useState("");
    const [filteredImage, setFilteredImage] = useState("");

    const activeUser = JSON.parse(sessionStorage.getItem("gallery_user"));
    const { galleryId } = useParams();

    const getPhotosFromGallery = () => {
        // After the data comes back from the API, we
        // use the setGalleryPhotos function to update state
        return getPhotosByGalleryId(parseInt(galleryId)).then(photosFromAPI => {
            setGalleryPhotos(photosFromAPI);
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
        // clear the current selection when user selects another photo,
        // but keep the new photo selected.
        handleCancelForm(false);

        getPhotoById(photoId).then(photoFromAPI => {
            setPhotoSelected(photoFromAPI);
            setIsSelected(true);
        })
    }

    // search the photos for the keywords entered
    const handleSearchPhotos = () => {

        let searchResult = []
        galleryPhotos.map(photo => {

            if (photo.keywords?.match(new RegExp(keywordsToSearch.replace(' ', '|').replace(',', '|'), 'gi'))) {
                searchResult.push(photo);
            }
        })
        setFoundPhotos(searchResult);

        // no need to update the state here for keywordsToSearch as it will clear 
        // the search input field. The user should see what keywords he searched for.
    }

    // apply the selected image-filter and show filter-preview.
    const handleFilterPreview = (event) => {

        if (parseInt(event.target.value) !== 0) {

            // Show filter preview on the original-photo selected from gallery.
            // filteredImage is a url of the selected photo with filter applied. It will
            // be an empty string until user makes his first selection from the dropdown.
            if (filteredImage === "") {

                if (photoSelected.imageUrl.includes('e_art')) {

                    // In the past, this photo was saved to the gallery with filter applied.
                    let lastAppliedFilter = photoSelected.imageUrl.split('e_art:').pop().split('/v')[0];

                    setFilteredImage(photoSelected.imageUrl?.replace(`/upload/e_art:${lastAppliedFilter}/`, `/upload/e_art:${event.target.value}/`));
                } else {

                    // Applying image filter to this photo for the very first time.
                    setFilteredImage(photoSelected.imageUrl?.replace('/upload/', `/upload/e_art:${event.target.value}/`));
                }
            }

            // if we are here, the filteredImage will always have 'e_art' in it 
            // because the user is trying different filters from the dropdown.
            let previousFilter = "";
            if (filteredImage) {

                previousFilter = filteredImage.split('e_art:').pop().split('/v')[0];

                if (previousFilter !== `${event.target.value}/`) {

                    if (photoSelected.imageUrl.includes('e_art')) {
                        // change the filter preview when user selects another filter from dropdown.
                        setFilteredImage(photoSelected.imageUrl?.replace(`/upload/e_art:${previousFilter}/`, `/upload/e_art:${event.target.value}/`));
                    } else {
                        // trying different filters on this photo for the first time.
                        setFilteredImage(photoSelected.imageUrl?.replace('/upload/', `/upload/e_art:${event.target.value}/`));
                    }
                }
            }
        } else {

            // if the user accidently selects the 0th option (Select filter) 
            // from the dropdown then do not show filter preview.
            setFilteredImage("");
        }
    }

    const handleSaveForm = (event) => {

        // add keywords to the photo only if user has entered keywords
        // otherwise, keep the existing keywords.
        let newKeywords = "";
        if (keywordsToAdd !== "") {
            newKeywords = keywordsToAdd;

            // if the photo already have keywords, add to the existing keywords
            if (photoSelected.keywords) {
                newKeywords = photoSelected.keywords + ',' + newKeywords;
            }
        } else {
            newKeywords = photoSelected?.keywords;
        }

        // apply image filter to the photo selected.
        // if no filter selected, keep original photo.
        let newImageUrl = "";
        if (filteredImage !== "") {
            // filteredImage is the url of the image with filter applied
            newImageUrl = filteredImage;
        } else {
            newImageUrl = photoSelected.imageUrl;
        }

        // add keywords to the photo object and update it in the database.
        // replace the original photo in the database with the filtered image. 
        const editedPhoto = {
            imageUrl: newImageUrl,
            galleryId: photoSelected.galleryId,
            userId: activeUser.id,
            keywords: newKeywords,
            id: photoSelected.id
        };

        updatePhoto(editedPhoto).then(updatedPhoto => {

            // get the gallery photos from the API after adding keywords and image filter  
            // to the selected photo, and update the component state (galleryPhotos)
            getPhotosFromGallery();

            // update component states to clear the input field
            setKeywordsToAdd("");
            setFilteredImage("");
            setIsSelected(false);
            setPhotoSelected({});
        })
    }

    // reset the current selections
    const handleCancelForm = (resetImageSelected = true) => {

        if (filteredImage) {
            setFilteredImage("");
        }

        if (keywordsToAdd) {
            setKeywordsToAdd("");
        }

        if (isSelected) {
            setIsSelected(false);
        }

        if (resetImageSelected && photoSelected) {
            setPhotoSelected({});
        }
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
                        id="keyword" onChange={(e) => handleControlledInputChange(e)} required autoFocus value={keywordsToSearch} />
                    <button className="btn btn-success my-2 my-sm-0" type="submit"
                        onClick={() => handleSearchPhotos()}>Search</button>
                </div>
                
                <div className="photos-aside-div">
                    <div className="allPhotos-div">
                        {foundPhotos.length > 0 ?
                            <Row>
                                {foundPhotos.map(photo => {
                                    return (<div className="col-sm-4 pb-3" key={photo.id}>
                                        <img style={{ width: 300, height: 200 }} className={`${photo.id === photoSelected.id ? "selected" : "not-selected"}`}
                                            src={photo.imageUrl} alt="3 column grid"
                                            onClick={() => imageSelected(photo.id)}>
                                        </img>
                                    </div>)
                                })
                                }
                            </Row>
                            :
                            <Row>
                                {galleryPhotos.map(photo => {
                                    return (<div className="col-sm-4 pb-3" key={photo.id}>
                                        <img style={{ width: 300, height: 200 }} className={`${photo.id === photoSelected.id ? "selected" : "not-selected"}`}
                                            src={photo.imageUrl} alt="3 column grid"
                                            onClick={() => imageSelected(photo.id)}></img>
                                    </div>)
                                })
                                }
                            </Row>
                        }


                    </div>
                    <aside>
                        <div>
                            <form>
                                <div className="col-12 col-md-12 col-lg-12 col-sm-4 sidePanel">
                                    <div className="card shadow-2-strong mt-3" style={{ width: 300, backgroundColor: '#FFF6EA' }}>
                                        <label className="form-label mx-2 mt-2 label-sel-pic" htmlFor="form-card">
                                            <span className={`${isSelected ? "hideLabel" : "showBlue"}`}> Please select a photo to edit </span>
                                        </label>
                                        {isSelected &&
                                            <div>
                                                <label className="form-label mx-3 mt-3" htmlFor="newKeyword">Add keywords to photo</label>
                                                <div>
                                                    <input type="text" id="newKeyword" onChange={(e) => handleNewKeywordInput(e)} required autoFocus
                                                        className="form-control mx-2" style={{ width: 280 }} placeholder="Enter keywords" value={keywordsToAdd} />
                                                </div>

                                                <label className="form-label mx-3 mt-3" htmlFor="original">Original Image </label>
                                                <img id="original" className="mx-5 mt-1" style={{ width: 200, height: 150 }} src={photoSelected.imageUrl} alt='original image' />

                                                {filteredImage !== "" &&
                                                    <>
                                                        <label className="form-label mx-3 mt-3" htmlFor="filterPreview">Filter Preview </label>
                                                        <img id="filterPreview" className="mx-5 mt-1" style={{ width: 200, height: 150 }} src={filteredImage} alt='filtered image' />
                                                    </>
                                                }

                                                <label className="form-label mx-3 mt-3" htmlFor="imageTrans">Image filters </label>
                                                <div>
                                                    <select name="imageTrans" id="imageTrans" style={{ width: 280 }}
                                                        onChange={(e) => handleFilterPreview(e)} className="form-select mx-2 my-1" >
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
                                                </div>
                                                <div className="form-btn-div my-3">
                                                    <button className="btn btn-success mx-2 my-2" type="button" style={{ width: 150 }}
                                                        onClick={() => handleCancelForm()}>Cancel</button>
                                                    <button className={`${keywordsToAdd || filteredImage ? "btn btn-success mx-2 my-2" : "btn btn-secondary mx-2 my-2 disabled"}`}
                                                        type="button" style={{ width: 150 }}
                                                        onClick={() => handleSaveForm()}>Save</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </aside>
                </div>
                <br></br>
            </div>
        </>
    );
}