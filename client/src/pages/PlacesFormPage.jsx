import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import { Upload, Link as LinkIcon, Trash2 } from 'lucide-react';

const PlacesFormPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState('');
    const [loading, setLoading] = useState(false);

    const perksList = [
        { key: 'wifi', label: 'Wifi', icon: '📶' },
        { key: 'parking', label: 'Free parking spot', icon: '🅿️' },
        { key: 'tv', label: 'TV', icon: '📺' },
        { key: 'radio', label: 'Radio', icon: '📻' },
        { key: 'pets', label: 'Pets', icon: '🐕' },
        { key: 'entrance', label: 'Private entrance', icon: '🚪' },
    ];

    useEffect(() => {
        if (!id) return;

        const fetchPlace = async () => {
            try {
                const { data } = await axiosInstance.get(`/places/${id}`);
                const place = data.place;
                setTitle(place.title);
                setAddress(place.address);
                setAddedPhotos(place.photos);
                setDescription(place.description);
                setPerks(place.perks);
                setExtraInfo(place.extraInfo);
                setMaxGuests(place.maxGuests);
                setPrice(place.price);
            } catch (error) {
                toast.error('Failed to load accommodation details');
            }
        };

        fetchPlace();
    }, [id]);

    const addPhotoByLink = async (e) => {
        e.preventDefault();
        if (!photoLink) return;

        try {
            const { data } = await axiosInstance.post('/places/upload-by-link', {
                link: photoLink,
            });
            setAddedPhotos(prev => [...prev, data]);
            setPhotoLink('');
            toast.success('Photo added successfully');
        } catch (error) {
            toast.error('Failed to add photo');
        }
    };

    const uploadPhoto = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/places/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAddedPhotos(prev => [...prev, ...response.data]);
            toast.success('Photos uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload photos');
        } finally {
            setLoading(false);
        }
    };

    const removePhoto = (link) => {
        setAddedPhotos(prev => prev.filter(photo => photo !== link));
    };

    const selectAsMainPhoto = (link) => {
        setAddedPhotos(prev => [link, ...prev.filter(photo => photo !== link)]);
    };

    const handlePerksChange = (perk) => {
        setPerks(prev =>
            prev.includes(perk)
                ? prev.filter(p => p !== perk)
                : [...prev, perk]
        );
    };

    const savePlace = async (e) => {
        e.preventDefault();
        setLoading(true);

        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price,
        };

        try {
            if (id) {
                // Update existing place
                await axiosInstance.put('/places/user/update', { id, ...placeData });
                toast.success('Accommodation updated successfully!');
            } else {
                // Create new place
                await axiosInstance.post('/places/user/add', placeData);
                toast.success('Accommodation created successfully!');
            }
            setRedirect('/account/places');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save accommodation';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <AccountNav />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">
                    {id ? 'Edit Accommodation' : 'Add New Accommodation'}
                </h1>

                <form onSubmit={savePlace} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title, for example: My lovely apartment"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address to this place"
                            required
                        />
                    </div>

                    {/* Photos */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Photos</label>
                        <div className="flex gap-2 mb-4">
                            <Input
                                type="url"
                                value={photoLink}
                                onChange={(e) => setPhotoLink(e.target.value)}
                                placeholder="Add using a link ....jpg"
                                className="flex-1"
                            />
                            <Button type="button" onClick={addPhotoByLink} variant="outline">
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                            {addedPhotos.map((link, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={link}
                                        alt=""
                                        className="w-full h-32 object-cover rounded cursor-pointer"
                                        onClick={() => selectAsMainPhoto(link)}
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-black text-white text-xs px-1 rounded">
                                            Main
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(link)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400">
                                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Upload</span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={uploadPhoto}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">
                            First photo will be the cover image. Click on photos to reorder.
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description of the place"
                            rows={4}
                        />
                    </div>

                    {/* Perks */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Perks</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {perksList.map((perk) => (
                                <label key={perk.key} className="flex items-center gap-2 border p-3 rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={perks.includes(perk.key)}
                                        onChange={() => handlePerksChange(perk.key)}
                                    />
                                    <span className="text-lg">{perk.icon}</span>
                                    <span className="text-sm">{perk.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Extra Info */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Extra Info</label>
                        <Input
                            value={extraInfo}
                            onChange={(e) => setExtraInfo(e.target.value)}
                            placeholder="House rules, etc."
                            rows={3}
                        />
                    </div>

                    {/* Check-in/out times and Max Guests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Max number of guests</label>
                            <Input
                                type="number"
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Price per night (Rs)</label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PlacesFormPage;
