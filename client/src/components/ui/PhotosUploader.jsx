import React, { useState } from 'react';
import Image from './Image';
import axiosInstance from '../../utils/axios';

const PhotosUploader = ({ addedPhotos, setAddedPhotos }) => {
    const [photoLink, setphotoLink] = useState('');
    const [uploading, setUploading] = useState(false);

    const addPhotoByLink = async (e) => {
        e.preventDefault();
        if (!photoLink.trim()) return;

        try {
            setUploading(true);
            const { data: filename } = await axiosInstance.post('/upload-by-link', {
                link: photoLink,
            });
            const newPhotos = [...addedPhotos, filename];
            setAddedPhotos(newPhotos);
            setphotoLink('');
        } catch (error) {
            console.error('Error uploading photo by link:', error);
            alert('Failed to upload photo by link: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const uploadPhoto = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const data = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append('photos', files[i]);
            }

            const { data: filenames } = await axiosInstance.post('/upload', data, {
                headers: { 'Content-type': 'multipart/form-data' },
            });

            const newPhotos = [...addedPhotos, ...filenames];
            setAddedPhotos(newPhotos);
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Failed to upload files: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = (filename) => {
        const newPhotos = addedPhotos.filter((photo) => photo !== filename);
        setAddedPhotos(newPhotos);
    };

    const selectAsMainPhoto = (e, filename) => {
        e.preventDefault();
        const newPhotos = [
            filename,
            ...addedPhotos.filter((photo) => photo !== filename),
        ];
        setAddedPhotos(newPhotos);
    };

    return (
        <>
            <div className="flex gap-2">
                <input
                    value={photoLink}
                    onChange={(e) => setphotoLink(e.target.value)}
                    type="text"
                    placeholder="Add using a link ...jpg"
                    disabled={uploading}
                />
                <button
                    className="rounded-2xl bg-gray-200 px-4 disabled:opacity-50"
                    onClick={addPhotoByLink}
                    disabled={uploading || !photoLink.trim()}
                >
                    {uploading ? 'Adding...' : 'Add photo'}
                </button>
            </div>

            {uploading && (
                <div className="text-center py-2">
                    <span className="text-blue-600">Uploading...</span>
                </div>
            )}

            <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6 ">
                {Array.isArray(addedPhotos) && addedPhotos.length > 0 &&
                    addedPhotos.map((link, index) => (
                        <div className="relative flex h-32" key={link || index}>
                            <Image
                                className="w-full rounded-2xl object-cover"
                                src={link}
                                alt=""
                            />
                            <button
                                onClick={() => removePhoto(link)}
                                className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-black bg-opacity-50 p-1 text-white hover:bg-opacity-70"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => selectAsMainPhoto(e, link)}
                                className="absolute bottom-1 left-1 cursor-pointer rounded-full bg-black bg-opacity-50 p-1 text-white hover:bg-opacity-70"
                            >
                                {link === addedPhotos[0] && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}

                                {link !== addedPhotos[0] && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    ))}
                <label className="flex h-32 cursor-pointer items-center justify-center gap-1 rounded-2xl border bg-transparent p-2 text-2xl text-gray-600">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={uploadPhoto}
                        disabled={uploading}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                    </svg>
                    {uploading ? 'Uploading...' : 'Upload'}
                </label>
            </div>
        </>
    );
};

export default PhotosUploader;
