import React, { useState, useEffect } from "react";
import { LeadService } from "../services/leadService";
import type { Lead } from "../types/Lead";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  MailIcon,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
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
} from "./ui/select";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await LeadService.list("-created_date");
      setLeads(data);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
    setIsLoading(false);
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      await LeadService.update(id, { status });
      // Update local state to avoid a full refetch
      setLeads(
        leads.map((lead) => (lead.$id === id ? { ...lead, status } : lead))
      );
      if (selectedLead && selectedLead.$id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const deleteLead = async () => {
    if (!leadToDelete?.$id) return;

    try {
      await LeadService.delete(leadToDelete.$id);
      setLeads(leads.filter((lead) => lead.$id !== leadToDelete.$id));
      if (selectedLead && selectedLead.$id === leadToDelete.$id) {
        setSelectedLead(null);
      }
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleDeleteClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const filteredLeads =
    filterStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === filterStatus);

  const getStatusBadge = (status: Lead["status"]) => {
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
                      <TableRow>
                        <td colSpan={4} className="text-center py-8">
                          Loading leads...
                        </td>
                      </TableRow>
                    ) : filteredLeads.length === 0 ? (
                      <TableRow>
                        <td colSpan={4} className="text-center py-8">
                          No leads found
                        </td>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <motion.tr
                          key={lead.$id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <MailIcon className="w-4 h-4 text-gray-400" />
                              {lead.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(
                                new Date(lead.$createdAt || lead.contact_date),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={lead.status}
                                onValueChange={(value) =>
                                  updateLeadStatus(
                                    lead.$id!,
                                    value as Lead["status"]
                                  )
                                }
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <SelectValue />
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
                                size="sm"
                                onClick={(e) => handleDeleteClick(lead, e)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Lead Details Panel */}
          <div className="md:w-1/3">
            {selectedLead ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Lead Details
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLead(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {selectedLead.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Message
                    </label>
                    <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedLead.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Source
                    </label>
                    <p className="text-sm">{selectedLead.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contact Date
                    </label>
                    <p className="text-sm">
                      {format(
                        new Date(
                          selectedLead.$createdAt || selectedLead.contact_date
                        ),
                        "PPpp"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a lead to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
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
            <DialogFooter>
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
    </div>
  );
}
