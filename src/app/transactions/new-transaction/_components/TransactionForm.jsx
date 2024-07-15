"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import customStyles from "./formStyle";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MdOutlinePersonRemove } from "react-icons/md";
import { FaTrashArrowUp } from "react-icons/fa6";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useForm } from "react-hook-form";

const TransactionForm = ({
  bankSampahProfile,
  customers,
  trashes,
  onTotals,
  onSubmitTransaction,
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

  const { handleSubmit, control, reset } = useForm();

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

  useEffect(() => {
    updateTotals();
  }, [customerForms]);

  // Function to validate the form
  const validateForm = () => {
    for (const form of customerForms) {
      if (!form.customer) {
        return false;
      }
      for (const trashForm of form.trashForms) {
        if (!trashForm.trash || trashForm.weight <= 0) {
          alert("Pastikan data yang diinput benar");
          return false;
        }
      }
    }
    return true;
  };

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
    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  const handleTrashChange = (customerId, trashId, field, value) => {
    setCustomerForms((prevForms) =>
      prevForms.map((form) =>
        form.id === customerId
          ? {
              ...form,
              trashForms: form.trashForms.map((trashForm) =>
                trashForm.id === trashId
                  ? { ...trashForm, [field]: value }
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
    onSubmitTransaction(totals);
  };

  const updateTotals = () => {
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

    setTotals({
      totalWeight,
      totalPrice,
      totalTransactions: customerForms.length,
      customerTotals,
      trashTotals,
    });

    onTotals({
      totalWeight,
      totalPrice,
      totalTransactions: customerForms.length,
      customerTotals,
      trashTotals,
    });
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
                  className="grid items-center gap-2 w-full relative"
                >
                  <Separator className="my-3" />
                  <div className="text-xs sm:text-sm font-semibold flex items-center justify-between pl-2">
                    <div className="text-base">Nasabah ke {index + 1}</div>
                    <Button
                      type="button"
                      className=" bg-transparent text-white hover:text-red-400 hover:bg-red-700/10"
                      onClick={() => removeCustomerForm(form.id)}
                      disabled={customerForms.length === 1}
                    >
                      <MdOutlinePersonRemove size={18} />
                    </Button>
                  </div>
                  <div className="grid md:flex items-center gap-2">
                    <Select
                      placeholder="Pilih Nasabah..."
                      className="basic-single w-full"
                      styles={{
                        ...customStyles,
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isDisabled
                            ? "#151518"
                            : state.isFocused
                            ? "#09090B"
                            : "#151518", // Ubah warna opsi yang didisable menjadi lebih gelap
                          color: state.isDisabled ? "#787777" : "white", // Ubah warna teks opsi yang didisable menjadi abu-abu
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
                      className="grid w-full md:grid-cols-2 items-center gap-5 mt-3"
                    >
                      <div className="grid md:flex gap-2 md:gap-5 items-center  w-full">
                        <div className="text-xs sm:text-sm font-semibold pl-2 md:w-1/3">
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
                                ? "#151518"
                                : state.isFocused
                                ? "#09090B"
                                : "#151518", // Ubah warna opsi yang didisable menjadi lebih gelap
                              color: state.isDisabled ? "#787777" : "white", // Ubah warna teks opsi yang didisable menjadi abu-abu
                            }),
                          }}
                          options={trashOptions}
                          isSearchable={true}
                          onChange={(selectedOption) =>
                            handleTrashChange(
                              form.id,
                              trashForm.id,
                              "trash",
                              selectedOption.value
                            )
                          }
                          filterOption={trashFilterOption}
                          value={trashes.find(
                            (option) => option.value === trashForm.trash
                          )}
                        />
                      </div>
                      <div className="grid md:flex items-center gap-2">
                        <div className="text-xs sm:text-sm font-semibold w-full pl-2">
                          Berat Sampah
                        </div>
                        <div className="flex items-center w-full">
                          <input
                            type="number"
                            className="bg-[#151518] rounded-lg p-2 py-2.5 pl-3 w-full"
                            value={trashForm.weight}
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
                        <Button
                          type="button"
                          variant="destructive"
                          className="text-white hover:text-red-600 gap-1 mt-2 md:mt-0"
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
                    className="flex items-center gap-2 bg-transparent text-white hover:bg-white/5 mt-3"
                    onClick={() => addNewTrashForm(form.id)}
                  >
                    <FaTrashArrowUp size={15} />
                    <div>Tambah Sampah</div>
                  </Button>
                </div>
              );
            })}
        </div>
        {!isFormValid && (
          <div className="text-red-500 text-center">
            Semua field harus diisi atau berat tidak boleh 0.
          </div>
        )}
        <div className="grid md:flex items-center justify-between gap-1 md:gap-10 py-3">
          <Button
            variant="outline"
            size="sm"
            className="flex w-auto items-center gap-2 py-6 bg-transparent text-white hover:bg-white/5 mt-5"
            onClick={addNewCustomerForm}
          >
            <BsFillPersonPlusFill size={18} />
            Transaksi Nasabah Baru
          </Button>
          <Button
            type="submit"
            size="sm"
            className="w-auto text-sm mt-5 px-16 py-4 hover:"
          >
            Buat Transaksi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
