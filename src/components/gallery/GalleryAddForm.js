import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addGallery } from '../../modules/GalleryManager';
import { getAllLayouts } from '../../modules/LayoutManager';
import './GalleryAddEditForm.css'

export const GalleryAddForm = () => {

	const [galleryObj, setGallery] = useState({
		name: "",
		date: "",
        userId: 0,
        layoutId: 0
	});

    const [layouts, setLayouts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

	const handleControlledInputChange = (event) => {
		
		const newGallery = { ...galleryObj }
		let selectedVal = event.target.value

		newGallery[event.target.id] = selectedVal
		// update state
		setGallery(newGallery)		
	}

    useEffect(() => {
		//load layout data and setState
        
        getAllLayouts().then(layoutsFromAPI => {
            setLayouts(layoutsFromAPI)
        });
		setIsLoading(false);
	}, []);

	const handleClickSaveGallery = (event) => {
		event.preventDefault()

        const userObj = JSON.parse(sessionStorage.getItem("gallery_user"))
		galleryObj.userId = userObj.id;

		if (galleryObj.name === "" || galleryObj.date === "" || galleryObj.layoutId === 0) {
			window.alert("Please enter name, date and layout for the gallery")
		} else {
			//invoke addGallery passing galleryObj as an argument.
			//once complete, change the url and display the Gallery list
			setIsLoading(true);
			addGallery(galleryObj)
				.then(() => navigate("/galleries"))
		}
	}   

	return (
		<form className="galleryForm">
			<h2 className="galleryForm__title">New Gallery</h2>
			<fieldset>
				<div className="form-group">
					<label htmlFor="name">Gallery name:</label>
					<input type="text" id="name" onChange={handleControlledInputChange} required autoFocus className="form-control" placeholder="Gallery name" value={galleryObj.name} />
				</div>
			</fieldset>
			<fieldset>
				<div className="form-group">
					<label htmlFor="date">Gallery date:</label>
					<input type="datetime-local" id="date" onChange={handleControlledInputChange} required autoFocus className="form-control" placeholder="Event date" value={galleryObj.date} />
				</div>
			</fieldset>
            <fieldset>
				<div className="form-group">
					<label htmlFor="layout">Assign to layout: </label>
					<select value={galleryObj.layoutId} name="layoutId" id="layoutId" onChange={handleControlledInputChange} className="form-control" >
						<option value="0">Select a layout</option>
						{layouts.map(l => (
							<option key={l.id} value={l.id}>
								{l.name}
							</option>
						))}
					</select>
				</div>
			</fieldset>
			<div className="galleryFormButtons">
				<button type="button" className="btn btn-primary"
					disabled={isLoading}
					onClick={handleClickSaveGallery}>
					Save Gallery
			</button>
			<button 
				type="button"
				className="btn btn-primary"
				onClick={() => {navigate("/galleries")}}>
				Cancel
			</button>
			</div>
		</form>
	)
};
