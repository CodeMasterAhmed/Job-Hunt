import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const { id } = useParams(); // Destructure 'id' directly
    useGetCompanyById(id);
    
    // State for input fields
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: ""
    });
    
    const [file, setFile] = useState(null); // State for new file
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL
    const navigate = useNavigate();

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    }

    // Handle file input changes
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Update preview URL for selected file
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        
        if (file) { // Only append file if a new one is selected
            formData.append("file", file);
        } else if (singleCompany.logo) {
            formData.append("existingLogo", singleCompany.logo); // Append existing logo identifier
        }
        
        try {
            setLoading(true);
            const response = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error("Error updating company:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Populate form with existing company data
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || ""
            });

            // Set preview URL to existing logo URL if available
            if (singleCompany.logo) {
                setPreviewUrl(singleCompany.logo); // Ensure this is a valid URL
            }
        }
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button 
                            type="button" // Prevent form submission on click
                            onClick={() => navigate("/admin/companies")} 
                            variant="outline" 
                            className="flex items-center gap-2 text-gray-500 font-semibold"
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Company Name */}
                        <div>
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={input.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                type="text"
                                id="description"
                                name="description"
                                value={input.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {/* Website */}
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                type="url"
                                id="website"
                                name="website"
                                value={input.website}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Location */}
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                value={input.location}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Logo */}
                        <div>
                            <Label htmlFor="file">Logo</Label>
                            {previewUrl && (
                                <img 
                                    src={previewUrl} 
                                    alt="Company Logo" 
                                    className="w-24 h-24 mb-2 object-cover" 
                                />
                            )}
                            <Input
                                type="file"
                                id="file"
                                name="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    {/* Hidden Input for Existing Logo */}
                    {!file && singleCompany.logo && (
                        <Input
                            type="hidden"
                            name="existingLogo"
                            value={singleCompany.logo}
                        />
                    )}
                    {/* Submit Button */}
                    {
                        loading 
                        ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                            </Button>
                          ) 
                        : (
                            <Button type="submit" className="w-full my-4">
                                Update
                            </Button>
                          )
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup;
