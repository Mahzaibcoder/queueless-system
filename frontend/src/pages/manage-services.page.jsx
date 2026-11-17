import { useState, useEffect } from "react";
import { serviceService, businessService } from "../services/api";
import { ServiceIcon, TrashIcon } from "../components/common/Icons";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function ManageServices() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      loadServices(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const loadInitialData = async () => {
    try {
      const bizRes = await businessService.getMyBusinesses();
      const list = bizRes.data || [];
      setBusinesses(list);
      if (list.length > 0) {
        setSelectedBusinessId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async (bizId) => {
    try {
      const { data } = await serviceService.getByBusiness(bizId);
      setServices(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId) {
      alert("Please select or create a business first.");
      return;
    }
    if (!name || !price) {
      alert("Please enter a service name and price.");
      return;
    }

    setSaving(true);
    try {
      const newSvc = {
        businessId: selectedBusinessId,
        business: selectedBusinessId,
        name,
        duration: parseInt(duration, 10),
        price: parseFloat(price),
        description,
      };
      const res = await serviceService.create(newSvc);
      if (res.error) {
        alert("Failed to add service: " + res.error);
      } else {
        setServices([...services, res.data]);
        setName("");
        setPrice("");
        setDescription("");
        alert("Service added successfully!");
      }
    } catch (err) {
      alert("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = (id) => {
    setServiceToDelete(id);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      const res = await serviceService.remove(serviceToDelete);
      if (res.error) {
        alert("Failed to delete service: " + res.error);
      } else {
        setServices(services.filter((s) => s.id !== serviceToDelete));
        setServiceToDelete(null);
      }
    } catch (err) {
      alert("Error deleting service");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#FAF7F2]">
        <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] min-h-[85vh]">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Navigation Link */}
        <div className="mb-4">
          <a
            href="/owner-dashboard"
            className="text-xs sm:text-sm font-bold text-[#636D62] hover:text-[#16261A] transition-colors inline-flex items-center gap-1.5 no-underline"
          >
            &larr; Back to Dashboard
          </a>
        </div>

        {/* Forest Green Header Banner */}
        <div className="bg-[#182B1F] text-[#FAF7F2] border border-[#273D2E] rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A948] bg-[#253E2C] border border-[#D9A948]/30 px-3 py-1 rounded-full mb-2">
              Catalog Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
              Service Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#B4C2AF] m-0">
              Add new services or manage existing appointment offerings for your customers.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {businesses.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A8B3A3] font-semibold">Business:</span>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="bg-[#253E2C] text-white border border-[#3D5C43] rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer outline-none focus:border-[#D9A948]"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#182B1F] text-white">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <span className="px-3.5 py-1 rounded-full bg-[#253E2C] text-[#D9A948] border border-[#D9A948]/30 text-xs font-bold">
              {services.length} Active Services
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Services List Area (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm sunnah-card-hover">
            <h2 className="text-xl font-bold text-[#16261A] pb-4 mb-6 border-b border-[#F2ECE0]">
              Existing Services ({services.length})
            </h2>

            {services.length > 0 ? (
              <div className="flex flex-col gap-4">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="border border-[#E8E2D5] rounded-2xl p-5 bg-[#FAF7F2] hover:bg-[#FAF6EF] transition-all flex justify-between items-center gap-4 sunnah-card-hover"
                  >
                    <div>
                      <h3 className="text-base font-bold text-[#16261A] mb-1">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-[#556054] mb-2">
                        {svc.description || "No description provided."}
                      </p>
                      <div className="text-xs font-bold text-[#16261A]">
                        ⏱ {svc.duration} Minutes Duration
                      </div>
                    </div>

                    <div className="text-right min-w-[90px] flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-xl font-black text-[#C49337]">
                        ${svc.price}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(svc.id)}
                        className="bg-[#FEF5F4] hover:bg-[#FDD8D5] text-[#C0392B] border border-[#F5C2BE] rounded-lg px-2.5 py-1 cursor-pointer text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <TrashIcon size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs sm:text-sm text-[#636D62]">
                No services currently listed. Use the form to add your first service.
              </div>
            )}
          </div>

          {/* Create Service Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-sm sunnah-card-hover h-fit">
            <h2 className="text-xl font-bold text-[#16261A] pb-4 mb-6 border-b border-[#F2ECE0]">
              Add New Service
            </h2>

            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#16261A] mb-1.5">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Haircut & Style"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#16261A] mb-1.5">Price ($) *</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16261A] mb-1.5">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all"
                  >
                    <option value="15">15 Mins</option>
                    <option value="30">30 Mins</option>
                    <option value="45">45 Mins</option>
                    <option value="60">60 Mins</option>
                    <option value="90">90 Mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16261A] mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Service Offer \u2192"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <ConfirmationModal
        isOpen={!!serviceToDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? Customers will no longer be able to book it."
        confirmText="Delete Service"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDeleteService}
        onClose={() => setServiceToDelete(null)}
      />
    </section>
  );
}
