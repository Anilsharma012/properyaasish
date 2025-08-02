import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Trash2,
  Edit,
  Plus,
  Home,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react';

interface SliderItem {
  _id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const HomepageSliderManagement = () => {
  const { user } = useAuth();
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<SliderItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    icon: '🏠',
    backgroundColor: 'from-[#C70000] to-red-600',
    textColor: 'text-white',
    isActive: true,
    order: 1,
  });

  const backgroundOptions = [
    { value: 'from-[#C70000] to-red-600', label: 'Red Gradient', preview: 'bg-gradient-to-r from-[#C70000] to-red-600' },
    { value: 'from-blue-500 to-blue-700', label: 'Blue Gradient', preview: 'bg-gradient-to-r from-blue-500 to-blue-700' },
    { value: 'from-green-500 to-green-700', label: 'Green Gradient', preview: 'bg-gradient-to-r from-green-500 to-green-700' },
    { value: 'from-purple-500 to-purple-700', label: 'Purple Gradient', preview: 'bg-gradient-to-r from-purple-500 to-purple-700' },
    { value: 'from-orange-500 to-orange-700', label: 'Orange Gradient', preview: 'bg-gradient-to-r from-orange-500 to-orange-700' },
    { value: 'from-gray-700 to-gray-900', label: 'Dark Gradient', preview: 'bg-gradient-to-r from-gray-700 to-gray-900' },
  ];

  const iconOptions = ['🏠', '🏢', '🏡', '🏘️', '🏰', '🏗️', '🏛️', '🏪', '🏫', '🏬', '🏭', '🏯'];

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/homepage-sliders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSliders(data.data || []);
      } else {
        console.error('Failed to fetch sliders');
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = selectedSlider 
        ? `/api/admin/homepage-sliders/${selectedSlider._id}`
        : '/api/admin/homepage-sliders';
      
      const method = selectedSlider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSliders();
        setEditDialogOpen(false);
        resetForm();
        alert(selectedSlider ? 'Slider updated successfully!' : 'Slider created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save slider');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      alert('Failed to save slider');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slider: SliderItem) => {
    setSelectedSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      icon: slider.icon,
      backgroundColor: slider.backgroundColor,
      textColor: slider.textColor,
      isActive: slider.isActive,
      order: slider.order,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (sliderId: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/homepage-sliders/${sliderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchSliders();
        alert('Slider deleted successfully!');
      } else {
        alert('Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('Failed to delete slider');
    }
  };

  const toggleSliderStatus = async (sliderId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/homepage-sliders/${sliderId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchSliders();
      } else {
        alert('Failed to update slider status');
      }
    } catch (error) {
      console.error('Error updating slider status:', error);
      alert('Failed to update slider status');
    }
  };

  const resetForm = () => {
    setSelectedSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      icon: '🏠',
      backgroundColor: 'from-[#C70000] to-red-600',
      textColor: 'text-white',
      isActive: true,
      order: 1,
    });
  };

  if (loading && sliders.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading sliders...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Homepage Slider Management</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage the hero slider section on the homepage with custom titles, subtitles, and styling.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Button onClick={fetchSliders} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Slider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedSlider ? 'Edit Slider' : 'Create New Slider'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Find Properties in Rohtak"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtitle *</Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Search from thousands of listings"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <span className="text-lg mr-2">{icon}</span>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="background">Background Style</Label>
                    <Select 
                      value={formData.backgroundColor} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, backgroundColor: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded ${option.preview}`}></div>
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  
                  {/* Preview */}
                  <div className="border rounded-lg p-4">
                    <Label className="text-sm font-medium mb-2 block">Preview:</Label>
                    <div className={`bg-gradient-to-r ${formData.backgroundColor} rounded-lg p-4 ${formData.textColor} relative overflow-hidden`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{formData.title || 'Slider Title'}</h3>
                          <p className="text-sm opacity-90">{formData.subtitle || 'Slider subtitle'}</p>
                        </div>
                        <div className="text-3xl">{formData.icon}</div>
                      </div>
                      <div className="absolute -right-2 -top-2 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                      <div className="absolute -right-6 -bottom-2 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : (selectedSlider ? 'Update' : 'Create')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditDialogOpen(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {sliders.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sliders found</h3>
              <p className="text-gray-600 mb-4">Create your first homepage slider to get started.</p>
              <Button onClick={() => setEditDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Slider
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliders
                  .sort((a, b) => a.order - b.order)
                  .map((slider) => (
                    <TableRow key={slider._id}>
                      <TableCell>{slider.order}</TableCell>
                      <TableCell>
                        <div className={`w-20 h-12 bg-gradient-to-r ${slider.backgroundColor} rounded-lg flex items-center justify-center ${slider.textColor}`}>
                          <span className="text-lg">{slider.icon}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{slider.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{slider.subtitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={slider.isActive ? "default" : "secondary"}>
                            {slider.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSliderStatus(slider._id, slider.isActive)}
                          >
                            {slider.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(slider)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(slider._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageSliderManagement;
