import React, { useState, useEffect } from "react";
import { Lead } from "@/entities/Lead";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MailIcon,
  MessageSquare,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  Users,
  UserCheck,
  X,
  Filter,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await Lead.list("-created_date");
      setLeads(data);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
    setIsLoading(false);
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await Lead.update(id, { status });
      // Update local state to avoid a full refetch
      setLeads(
        leads.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const deleteLead = async () => {
    if (!leadToDelete) return;

    try {
      await Lead.delete(leadToDelete.id);
      setLeads(leads.filter((lead) => lead.id !== leadToDelete.id));
      if (selectedLead && selectedLead.id === leadToDelete.id) {
        setSelectedLead(null);
      }
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleDeleteClick = (lead, e) => {
    e.stopPropagation();
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      contacted: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <MessageSquare className="w-3 h-3 mr-1" />,
      },
      qualified: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <Users className="w-3 h-3 mr-1" />,
      },
      converted: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      closed: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <X className="w-3 h-3 mr-1" />,
      },
    };

    return (
      <Badge
        variant="outline"
        className={`${statusConfig[status].color} border flex items-center gap-1`}
      >
        {statusConfig[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-500 mt-1">
            Track and manage all your website leads
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Leads</CardTitle>
                  <CardDescription>
                    {filterStatus === "all"
                      ? "All website leads"
                      : `${
                          filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)
                        } leads`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Leads</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={index} className="animate-pulse">
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                          </TableRow>
                        ))
                    ) : filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <TableCell>
                            <div className="font-medium flex items-center gap-2">
                              <MailIcon className="w-4 h-4 text-gray-400" />
                              {lead.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {format(
                                new Date(lead.contact_date),
                                "MMM d, yyyy"
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={lead.status}
                                onValueChange={(value) =>
                                  updateLeadStatus(lead.id, value)
                                }
                                onOpenChange={(open) => {
                                  if (open) {
                                    // This prevents the row click event from firing
                                    // when interacting with the select
                                    setTimeout(() => {
                                      const selectListbox =
                                        document.querySelector(
                                          '[role="listbox"]'
                                        );
                                      if (selectListbox) {
                                        selectListbox.addEventListener(
                                          "click",
                                          (e) => e.stopPropagation(),
                                          { once: true }
                                        );
                                      }
                                    }, 0);
                                  }
                                }}
                              >
                                <SelectTrigger
                                  className="h-8 w-[130px]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">
                                    Contacted
                                  </SelectItem>
                                  <SelectItem value="qualified">
                                    Qualified
                                  </SelectItem>
                                  <SelectItem value="converted">
                                    Converted
                                  </SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDeleteClick(lead, e)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No leads found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/3">
            {selectedLead ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Lead Details</span>
                      {getStatusBadge(selectedLead.status)}
                    </CardTitle>
                    <CardDescription>
                      Submitted on{" "}
                      {format(
                        new Date(selectedLead.contact_date),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Email
                      </h3>
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4 text-gray-500" />
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedLead.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Message
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                        {selectedLead.message}
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">
                        Update Status
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "new",
                          "contacted",
                          "qualified",
                          "converted",
                          "closed",
                        ].map((status) => (
                          <Button
                            key={status}
                            variant={
                              selectedLead.status === status
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateLeadStatus(selectedLead.id, status)
                            }
                            className={
                              selectedLead.status === status
                                ? ""
                                : "border-gray-200"
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center py-12 text-center bg-gray-50 border-dashed">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                <CardTitle className="text-gray-500 mb-2">
                  No Lead Selected
                </CardTitle>
                <CardDescription>
                  Click on a lead to view details
                </CardDescription>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteLead}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
