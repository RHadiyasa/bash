"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import customStyles from "./formStyle";
import { Loader2, ScaleIcon, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MdOutlinePersonRemove } from "react-icons/md";
import { FaTrashArrowUp } from "react-icons/fa6";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Summary from "./Summary";

const TransactionForm = ({
  bankSampahProfile,
  customers,
  trashes,
  onTotals,
  onSubmitTransaction,
  successfulTrashFormIds,
  saveTransaction,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [customerForms, setCustomerForms] = useState([]);
  const [totals, setTotals] = useState({
    totalWeight: 0,
    totalPrice: 0,
    totalTransactions: 0,
    customerTotals: {},
    trashTotals: {},
  });

  const { handleSubmit } = useForm();

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (bankSampahProfile) {
      setCustomerForms([
        {
          id: Date.now(),
          bankSampah: bankSampahProfile._id,
          customer: null,
          trashForms: [
            {
              id: Date.now(),
              trash: null,
              weight: 0,
            },
          ],
        },
      ]);
    }
  }, [bankSampahProfile]);

  const validateForm = useCallback(() => {
    for (const form of customerForms) {
      if (!form.customer) {
        setIsFormValid(false);
        return false;
      }
      for (const trashForm of form.trashForms) {
        if (!trashForm.trash || trashForm.weight <= 0) {
          setIsFormValid(false);
          return false;
        }
      }
    }
    setIsFormValid(true);
    return true;
  }, [customerForms]);

  const updateTotals = useCallback(() => {
    let totalWeight = 0;
    let totalPrice = 0;
    let customerTotals = {};
    let trashTotals = {};

    customerForms.forEach((form) => {
      const customer = customers.find((c) => c.value === form.customer);
      if (customer) {
        customerTotals[customer.label] = customerTotals[customer.label] || {
          totalWeight: 0,
          totalPrice: 0,
        };

        form.trashForms.forEach((trashForm) => {
          const trash = trashes.find((t) => t.value === trashForm.trash);
          if (trash) {
            const weight = parseFloat(trashForm.weight);
            const pricePerKg = parseFloat(trash.trashPrice);
            const price = weight * pricePerKg;

            if (!isNaN(weight) && !isNaN(price)) {
              totalWeight += weight;
              totalPrice += price;

              customerTotals[customer.label].totalWeight += weight;
              customerTotals[customer.label].totalPrice += price;

              trashTotals[trash.label] = trashTotals[trash.label] || {
                totalWeight: 0,
                totalPrice: 0,
              };

              trashTotals[trash.label].totalWeight += weight;
              trashTotals[trash.label].totalPrice += price;
            } else {
              console.error(`Invalid data: weight=${weight}, price=${price}`);
            }
          }
        });
      }
    });

    const nextTotals = {
      totalWeight,
      totalPrice,
      totalTransactions: customerForms.length,
      customerTotals,
      trashTotals,
    };

    setTotals(nextTotals);
    onTotals(nextTotals);
  }, [customerForms, customers, onTotals, trashes]);

  useEffect(() => {
    updateTotals();
    validateForm();
  }, [updateTotals, validateForm]);

  useEffect(() => {
    if (successfulTrashFormIds.size > 0) {
      setCustomerForms((prevForms) =>
        prevForms
          .map((form) => ({
            ...form,
            trashForms: form.trashForms.filter(
              (trashForm) => !successfulTrashFormIds.has(trashForm.id)
            ),
          }))
          .filter((form) => form.trashForms.length > 0)
      );
    }
  }, [successfulTrashFormIds])
  // Helper function to get selected customers and trashes
  const getSelectedOptions = () => {
    const selectedCustomers = customerForms.map((form) => form.customer);
    const selectedTrashes = customerForms.reduce((acc, form) => {
      acc[form.customer] = form.trashForms.map((trashForm) => trashForm.trash);
      return acc;
    }, {});
    return { selectedCustomers, selectedTrashes };
  };

  const removeCustomerForm = (id) => {
    setCustomerForms((prevForms) => prevForms.filter((form) => form.id !== id));
  };

  const customerFilterOption = (option, inputValue) => {
    const { rekening = "", label = "" } = option.data;
    return (
      rekening.toLowerCase().includes(inputValue.toLowerCase()) ||
      label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const trashFilterOption = (option, inputValue) => {
    const { trashName = "", label = "" } = option.data;
    return (
      trashName.toLowerCase().includes(inputValue.toLowerCase()) ||
      label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleCustomerChange = (id, field, value) => {
    const customer = customers.find((customer) => customer.value === value);
    const customerName = customer ? customer.customerName : null;

    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, [field]: value, customerName } : form
      )
    );
  };

  const handleTrashChange = (customerId, trashId, field, value, trashName) => {

    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === customerId
          ? {
              ...form,
              trashForms: form.trashForms.map((trashForm) =>
                trashForm.id === trashId
                  ? {
                      ...trashForm,
                      [field]: value,
                      trashName:
                        field === "trash"
                          ? trashes.find((t) => t.value === value)?.trashName ||
                            null
                          : trashForm.trashName,
                      transactionAmount:
                        field === "weight"
                          ? value *
                            (parseFloat(
                              trashes.find((t) => t.value === trashForm.trash)
                                ?.trashPrice || 0
                            ) || 0)
                          : trashForm.weight *
                            (parseFloat(
                              trashes.find((t) => t.value === value)
                                ?.trashPrice || 0
                            ) || 0),
                    }
                  : trashForm
              ),
            }
          : form
      )
    );
  };

  const addNewCustomerForm = () => {
    setCustomerForms([
      ...customerForms,
      {
        id: Date.now(),
        bankSampah: bankSampahProfile?._id,
        customer: null,
        trashForms: [
          {
            id: Date.now(),
            trash: null,
            weight: 0,
          },
        ],
      },
    ]);
  };

  const addNewTrashForm = (customerId) => {
    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === customerId
          ? {
              ...form,
              trashForms: [
                ...form.trashForms,
                {
                  id: Date.now(),
                  trash: null,
                  weight: 0,
                },
              ],
            }
          : form
      )
    );
  };

  const removeTrashForm = (customerId, trashId) => {
    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === customerId
          ? {
              ...form,
              trashForms: form.trashForms.filter(
                (trashForm) => trashForm.id !== trashId
              ),
            }
          : form
      )
    );
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      setIsFormValid(false);
      return;
    }
    setIsFormValid(true);
    onSubmitTransaction(totals, customerForms);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          {isMounted &&
            customerForms.map((form, index) => {
              const { selectedCustomers, selectedTrashes } =
                getSelectedOptions();
              const customerOptions = customers.map((customer) => ({
                ...customer,
                isDisabled:
                  selectedCustomers.includes(customer.value) &&
                  customer.value !== form.customer,
                style: {
                  opacity:
                    selectedCustomers.includes(customer.value) &&
                    customer.value !== form.customer
                      ? 0.5
                      : 1,
                },
              }));
              const trashOptions = trashes.map((trash) => ({
                ...trash,
                isDisabled:
                  selectedTrashes[form.customer]?.includes(trash.value) &&
                  trash.value !== form.trash,
                style: {
                  opacity:
                    selectedTrashes[form.customer]?.includes(trash.value) &&
                    trash.value !== form.trash
                      ? 0.5
                      : 1,
                },
              }));

              return (
                <div
                  key={form.id}
                  className="relative grid w-full items-center gap-4 rounded-lg border border-border/60 bg-background/45 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-extrabold">
                      Nasabah ke {index + 1}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => removeCustomerForm(form.id)}
                      disabled={customerForms.length === 1}
                      aria-label="Hapus form nasabah"
                    >
                      <MdOutlinePersonRemove size={18} />
                    </Button>
                  </div>
                  <div className="grid items-center gap-2">
                    <Select
                      placeholder="Pilih Nasabah..."
                      className="basic-single w-full"
                      styles={{
                        ...customStyles,
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isDisabled
                            ? "hsl(var(--muted) / 0.5)"
                            : state.isFocused
                            ? "hsl(var(--accent) / 0.7)"
                            : "transparent",
                          color: state.isDisabled
                            ? "hsl(var(--muted-foreground))"
                            : "hsl(var(--foreground))",
                        }),
                      }}
                      options={customers.map((customer) => ({
                        ...customer,
                        isDisabled: selectedCustomers.includes(customer.value), // Disable opsi yang sudah dipilih
                      }))}
                      isSearchable={true}
                      onChange={(selectedOption) =>
                        handleCustomerChange(
                          form.id,
                          "customer",
                          selectedOption.value
                        )
                      }
                      filterOption={customerFilterOption}
                      value={customers.find(
                        (option) => option.value === form.customer
                      )}
                    />
                  </div>
                  {form.trashForms.map((trashForm, index) => (
                    <div
                      key={trashForm.id}
                      className="mt-1 grid w-full items-center gap-4 rounded-lg border border-border/60 bg-background/45 p-4 md:grid-cols-2"
                    >
                      <div className="grid w-full gap-2">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Sampah ke {index + 1}
                        </div>
                        <Select
                          placeholder="Pilih Sampah..."
                          className="basic-single w-full"
                          styles={{
                            ...customStyles,
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isDisabled
                                ? "hsl(var(--muted) / 0.5)"
                                : state.isFocused
                                ? "hsl(var(--accent) / 0.7)"
                                : "transparent",
                              color: state.isDisabled
                                ? "hsl(var(--muted-foreground))"
                                : "hsl(var(--foreground))",
                            }),
                          }}
                          options={trashOptions}
                          isSearchable={true}
                          onChange={(selectedOption) =>
                            handleTrashChange(
                              form.id,
                              trashForm.id,
                              "trash",
                              selectedOption.value,
                              selectedOption.trashName
                            )
                          }
                          filterOption={trashFilterOption}
                          value={trashes.find(
                            (option) => option.value === trashForm.trash
                          )}
                        />
                      </div>
                      <div className="grid items-end gap-2 md:grid-cols-[1fr_auto]">
                        <div className="grid gap-2">
                        <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          Berat Sampah
                        </div>
                          <div className="relative">
                            <ScaleIcon
                              aria-hidden="true"
                              className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                              type="number"
                              className="glass-input h-11 w-full rounded-md px-3 pl-10 text-sm"
                              value={trashForm.weight}
                              onFocus={(e) => {
                                if (e.target.value === "0") {
                                  e.target.value = "";
                                }
                              }}
                              onBlur={(e) => {
                                if (e.target.value === "" || e.target.value < 0) {
                                  e.target.value = 0;
                                }
                                handleTrashChange(
                                  form.id,
                                  trashForm.id,
                                  "weight",
                                  e.target.value
                                );
                              }}
                              onChange={(e) =>
                                handleTrashChange(
                                  form.id,
                                  trashForm.id,
                                  "weight",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-11 gap-2 font-bold"
                          onClick={() => removeTrashForm(form.id, trashForm.id)}
                          disabled={form.trashForms.length === 1}
                        >
                          <Trash2 size={20} />{" "}
                          <div className="flex md:hidden">Hapus Sampah</div>
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    className="mt-1 flex h-11 items-center gap-2 bg-background/60 font-bold"
                    onClick={() => addNewTrashForm(form.id)}
                  >
                    <FaTrashArrowUp size={15} />
                    <div>Tambah Sampah</div>
                  </Button>
                </div>
              );
            })}
        </div>

        <div className="grid items-center justify-between gap-2 py-4 md:flex md:gap-10">
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="mt-2 flex h-11 w-auto items-center gap-2 bg-background/60 font-bold"
            onClick={addNewCustomerForm}
          >
            <BsFillPersonPlusFill size={18} />
            Transaksi Nasabah Baru
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-2 h-11 w-auto px-10 text-sm font-bold"
                disabled={!isFormValid}
              >
                <div className="font-bold">Buat Transaksi</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card !w-[min(94vw,760px)] rounded-lg">
              <DialogTitle className="text-xl">
                <div className="font-extrabold">Konfirmasi Transaksi</div>
                <DialogDescription>
                  Pastikan transaksi yang diinput sudah benar
                </DialogDescription>
              </DialogTitle>
              <Summary totals={totals} />
              <div className="mt-5">
                <Button
                  type="submit"
                  onClick={() => saveTransaction(totals, customerForms)}
                  className="w-full font-bold"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <div>Submit Transaction</div>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
